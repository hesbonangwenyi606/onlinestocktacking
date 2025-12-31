import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

export const listUsers = async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, role }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = { name, email };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
};

export const listAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({ where: { userId: req.user.id } });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        label: req.body.label,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        postal: req.body.postal,
        country: req.body.country,
        phone: req.body.phone
      }
    });
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    await prisma.address.delete({ where: { id: req.params.id } });
    res.json({ message: "Address removed" });
  } catch (error) {
    next(error);
  }
};
