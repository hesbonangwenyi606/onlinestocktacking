import React from "react";

const Footer = () => (
  <footer className="mt-16 border-t border-ink/10 bg-white/80 px-6 py-10 text-sm text-ink/70 dark:bg-night/80 dark:text-white/70">
    <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row">
      <div>
        <h4 className="font-display text-lg text-ink dark:text-white">OnlineStocktacking</h4>
        <p className="mt-2 max-w-sm">A premium storefront template built for conversion, speed, and operational clarity.</p>
      </div>
      <div className="flex gap-6">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest">Store</p>
          <p>Shipping</p>
          <p>Returns</p>
          <p>Support</p>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest">Company</p>
          <p>About</p>
          <p>Careers</p>
          <p>Press</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
