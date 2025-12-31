import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array()[0].msg));
  }

  const { name, email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409);
      return next(new Error("Email already registered"));
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });
    const token = generateToken(user);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401);
      return next(new Error("Invalid credentials"));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      return next(new Error("Invalid credentials"));
    }
    const token = generateToken(user);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    return next(error);
  }
};

export const logoutUser = async (_req, res) => {
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
