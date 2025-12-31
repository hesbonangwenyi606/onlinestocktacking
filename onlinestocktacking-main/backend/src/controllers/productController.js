import prisma from "../lib/prisma.js";

const getRatingsMap = async (productIds) => {
  if (!productIds.length) return {};
  const grouped = await prisma.review.groupBy({
    by: ["productId"],
    _avg: { rating: true },
    where: { productId: { in: productIds } }
  });
  return grouped.reduce((acc, item) => {
    acc[item.productId] = Number(item._avg.rating || 0);
    return acc;
  }, {});
};

export const listProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.category) {
      filters.categoryId = req.query.category;
    }
    if (req.query.search) {
      filters.name = { contains: req.query.search, mode: "insensitive" };
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.lte = Number(req.query.maxPrice);
    }

    let ratingProductIds = null;
    if (req.query.rating) {
      const grouped = await prisma.review.groupBy({
        by: ["productId"],
        _avg: { rating: true },
        having: {
          rating: {
            _avg: { gte: Number(req.query.rating) }
          }
        }
      });
      ratingProductIds = grouped.map((item) => item.productId);
      if (!ratingProductIds.length) {
        return res.json({
          items: [],
          pagination: { page, limit, total: 0, pages: 0 }
        });
      }
      filters.id = { in: ratingProductIds };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where: filters }),
      prisma.product.findMany({
        where: filters,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      })
    ]);

    const ratingsMap = await getRatingsMap(products.map((p) => p.id));
    const items = products.map((product) => ({
      ...product,
      rating: ratingsMap[product.id] || 0
    }));

    res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, reviews: { include: { user: true } } }
    });
    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }
    const ratingsMap = await getRatingsMap([product.id]);
    res.json({ ...product, rating: ratingsMap[product.id] || 0 });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        categoryId: req.body.categoryId || null,
        images
      }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : undefined;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        categoryId: req.body.categoryId || null,
        ...(images ? { images } : {})
      }
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const review = await prisma.review.create({
      data: {
        productId: req.params.id,
        userId: req.user.id,
        rating: Number(req.body.rating),
        comment: req.body.comment
      }
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const query = req.query.q || "";
    if (!query) {
      return res.json([]);
    }
    const products = await prisma.product.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 6,
      select: { id: true, name: true, images: true }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};
