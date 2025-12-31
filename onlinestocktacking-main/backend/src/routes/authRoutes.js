import express from "express";
import passport from "passport";
import { body } from "express-validator";
import { getMe, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

router.post(
  "/register",
  [body("name").notEmpty().withMessage("Name is required"), body("email").isEmail(), body("password").isLength({ min: 6 })],
  registerUser
);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

const oauthCallback = (req, res) => {
  const token = generateToken(req.user);
  const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}`;
  res.redirect(redirectUrl);
};

router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(501);
    return next(new Error("Google login not configured"));
  }
  return passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});
router.get("/google/callback", passport.authenticate("google", { session: false }), oauthCallback);

router.get("/facebook", (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID) {
    res.status(501);
    return next(new Error("Facebook login not configured"));
  }
  return passport.authenticate("facebook", { scope: ["email"], session: false })(req, res, next);
});
router.get("/facebook/callback", passport.authenticate("facebook", { session: false }), oauthCallback);

router.get("/twitter", (req, res, next) => {
  if (!process.env.TWITTER_CONSUMER_KEY) {
    res.status(501);
    return next(new Error("Twitter login not configured"));
  }
  return passport.authenticate("twitter", { session: false })(req, res, next);
});
router.get("/twitter/callback", passport.authenticate("twitter", { session: false }), oauthCallback);

export default router;
