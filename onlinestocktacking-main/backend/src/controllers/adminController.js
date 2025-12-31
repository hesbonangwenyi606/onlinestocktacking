import prisma from "../lib/prisma.js";

export const getAnalytics = async (_req, res, next) => {
  try {
    const [orderCount, userCount, totalSales, topProducts, salesByDay] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { totalPrice: true } }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5
      }),
      prisma.$queryRaw`
        SELECT DATE_TRUNC('day', created_at) AS day, SUM(total_price) AS total
        FROM "orders"
        GROUP BY day
        ORDER BY day ASC
        LIMIT 30
      `
    ]);

    const productIds = topProducts.map((item) => item.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const top = topProducts.map((item) => ({
      product: productMap[item.productId],
      quantity: item._sum.quantity
    }));

    res.json({
      orderCount,
      userCount,
      totalSales: Number(totalSales._sum.totalPrice || 0),
      topProducts: top,
      salesByDay
    });
  } catch (error) {
    next(error);
  }
};
