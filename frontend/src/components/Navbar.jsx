import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-sm uppercase tracking-wide ${isActive ? "text-accent" : "text-ink/70 dark:text-white/70"}`
    }
  >
    {children}
  </NavLink>
);

const Navbar = () => {
  const { items } = useContext(CartContext);
  const { items: wishlist } = useContext(WishlistContext);
  const { toggleTheme, theme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/80 backdrop-blur dark:bg-night/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-xl font-bold font-display">
          OnlineStocktacking
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar />
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <NavItem to="/products">Shop</NavItem>
          <NavItem to="/account">Account</NavItem>
          {user?.role === "ADMIN" && <NavItem to="/admin">Admin</NavItem>}
          <button className="text-sm" onClick={toggleTheme}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <Link to="/wishlist" className="text-sm">♥ {wishlist.length}</Link>
          <Link to="/cart" className="text-sm">Cart ({items.length})</Link>
          {user ? (
            <button className="text-sm" onClick={logout}>Sign out</button>
          ) : (
            <NavItem to="/login">Sign in</NavItem>
          )}
        </nav>
        <button className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
          ☰
        </button>
      </div>
      {open && (
        <div className="border-t border-ink/10 bg-white/90 px-6 py-4 backdrop-blur md:hidden">
          <div className="mb-4">
            <SearchBar />
          </div>
          <div className="flex flex-col gap-3">
            <NavItem to="/products">Shop</NavItem>
            <NavItem to="/account">Account</NavItem>
            {user?.role === "ADMIN" && <NavItem to="/admin">Admin</NavItem>}
            <Link to="/wishlist" className="text-sm">Wishlist ({wishlist.length})</Link>
            <Link to="/cart" className="text-sm">Cart ({items.length})</Link>
            <button className="text-sm" onClick={toggleTheme}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            {user ? (
              <button className="text-sm" onClick={logout}>Sign out</button>
            ) : (
              <NavItem to="/login">Sign in</NavItem>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
