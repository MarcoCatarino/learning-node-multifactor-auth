import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";

import { User } from "../models/userModel.model.js";
import { ENV } from "../config/env.js";

//TODO: Sign Up Controller
export const signupController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPossword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPossword,
      isMfaActive: false,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: `Success in creating user: ${newUser.username}` });
  } catch (error) {
    return res.status(500).json({ error: `Error in creating user` });
  }
};

//TODO: Log In Controller
export const loginController = async (req, res) => {
  try {
    console.log("User Auth: ", req.user);
    res.status(200).json({
      message: `Success in LogIn`,
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error in LogIn` });
  }
};

//TODO: Auth Status Controller
export const authStatusController = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: `Success in LogIn`,
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ error: `Unauthorized User` });
  }
};

//TODO: Log Out Controller
export const logoutController = async (req, res) => {
  if (!req.user) res.status(401).json({ message: `Unauthorized User` });

  req.logout((err) => {
    if (err) return res.status(400).json({ message: `User not LogIn` });

    res.status(200).json({ message: `LogOut Successfull` });
  });
};

//TODO: SetUp 2FA Controller
export const setup2FAController = async (req, res) => {
  try {
    console.log(`The req.user is: ${req.user}`);

    const user = req.user;

    var secret = speakeasy.generateSecret();
    console.log(`The secret object is`, secret);

    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;

    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "www.pruebauser.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrCode.toDataURL(url);

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrImageUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error Setting Up 2FA` });
  }
};

//TODO: Verify 2FA Controller
export const verify2FAController = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verifed = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (verifed) {
    const jwtToken = jwt.sign({ username: user.username }, ENV.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.status(200).json({ message: `2FA Token: `, token: jwtToken });
  } else {
    res.status(400).json({ message: `Invalid Token` });
  }
};

//TODO: Reset 2FA Controller
export const reset2FAController = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;

    await user.save();

    res.status(200).json({ message: `2FA Reset Success` });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error in setting 2FA`, message: error });
  }
};
