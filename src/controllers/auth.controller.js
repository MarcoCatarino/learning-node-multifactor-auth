import bcrypt from "bcryptjs";
import { User } from "../models/userModel.model.js";

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

export const logoutController = async (req, res) => {
  if (!req.user) res.status(401).json({ message: `Unauthorized User` });

  req.logout((err) => {
    if (err) return res.status(400).json({ message: `User not LogIn` });

    res.status(200).json({ message: `LogOut Successfull` });
  });
};

export const setup2FAController = async (req, res) => {
  try {
    res.status(200).json({ message: `Success in: ` });
  } catch (error) {
    return res.status(500).json({ error: `Error in ` });
  }
};

export const verify2FAController = async (req, res) => {
  try {
    res.status(200).json({ message: `Success in: ` });
  } catch (error) {
    return res.status(500).json({ error: `Error in ` });
  }
};

export const reset2FAController = async (req, res) => {
  try {
    res.status(200).json({ message: `Success in: ` });
  } catch (error) {
    return res.status(500).json({ error: `Error in ` });
  }
};
