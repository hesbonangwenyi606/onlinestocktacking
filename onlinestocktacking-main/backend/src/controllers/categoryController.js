import prisma from "../lib/prisma.js";

export const listCategories = async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.create({
      data: { name: req.body.name, description: req.body.description }
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name: req.body.name, description: req.body.description }
    });
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};
