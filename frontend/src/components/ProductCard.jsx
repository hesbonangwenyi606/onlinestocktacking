import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { items, toggleWishlist } = useContext(WishlistContext);
  const inWishlist = items.some((item) => item.id === product.id);

  return (
    <div className="card p-4 transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images?.[0] || "https://placehold.co/400x300"}
          alt={product.name}
          className="h-48 w-full rounded-2xl object-cover"
          loading="lazy"
        />
      </Link>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <button
            onClick={() => toggleWishlist(product)}
            className={`text-xl ${inWishlist ? "text-accent" : "text-ink/40"}`}
          >
            ♥
          </button>
        </div>
        <Rating value={product.rating || 0} />
        <p className="text-sm text-ink/70 dark:text-white/70">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">${Number(product.price).toFixed(2)}</span>
          <button className="btn-primary" onClick={() => addToCart(product, 1)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
