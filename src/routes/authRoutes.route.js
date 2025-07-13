import { Router } from "express";
import passport from "passport";

import {
  authStatusController,
  loginController,
  logoutController,
  signupController,
  reset2FAController,
  setup2FAController,
  verify2FAController,
} from "../controllers/auth.controller.js";

const router = Router();

// todo: Basic Routes
//? SignUp Route
router.post("/signup", signupController);

//? LogIn Route
router.post("/login", passport.authenticate("local"), loginController);

//? Auth Status Route
router.get("/status", authStatusController);

//? LogOut Route
router.post("/logout", logoutController);

// todo: 2FA (2 Factor Authentication)
//? 2FA SetUp Route
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: `Unauthorized` });
  },
  setup2FAController
);

//? 2FA Verify Token Route
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: `Unauthorized User` });
  },
  verify2FAController
);

//? 2FA Reset Token Route
router.post(
  "/2fa/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: `Unauthorized User` });
  },
  reset2FAController
);

export default router;
