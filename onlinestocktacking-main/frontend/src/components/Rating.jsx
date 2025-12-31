import React from "react";

const Rating = ({ value = 0 }) => {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-xs text-amber-500">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < rounded ? "★" : "☆"}</span>
      ))}
      <span className="ml-2 text-ink/60 dark:text-white/60">{value.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
