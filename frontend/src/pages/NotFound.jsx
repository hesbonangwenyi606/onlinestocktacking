import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto max-w-4xl px-6 py-12 text-center">
    <h1 className="font-display text-4xl">404</h1>
    <p className="mt-2 text-ink/70 dark:text-white/70">The page you are looking for does not exist.</p>
    <Link className="btn-primary mt-6" to="/">Back home</Link>
  </div>
);

export default NotFound;
