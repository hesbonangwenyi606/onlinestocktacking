import React, { createContext, useEffect, useMemo, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product) => {
    setItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const value = useMemo(() => ({ items, toggleWishlist }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
