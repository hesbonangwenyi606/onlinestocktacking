import React from "react";

const Loader = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center gap-2 text-sm text-ink/70 dark:text-white/70">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    <span>{label}</span>
  </div>
);

export default Loader;
