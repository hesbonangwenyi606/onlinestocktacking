import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-ink/70 dark:text-white/70">Start adding products to see them here.</p>
        <Link to="/products" className="btn-primary mt-6">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl">Your cart</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center gap-4 p-4">
              <img
                src={item.images?.[0] || "https://placehold.co/120x120"}
                alt={item.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-ink/60 dark:text-white/60">${Number(item.price).toFixed(2)}</p>
              </div>
              <input
                className="input w-20"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
              />
              <button className="text-sm text-red-500" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Summary</h2>
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <button className="btn-primary w-full" onClick={() => navigate("/checkout")}>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
