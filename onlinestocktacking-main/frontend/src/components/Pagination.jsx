import React from "react";

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="btn-outline"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>
      <span className="text-sm">Page {page} of {pages}</span>
      <button
        className="btn-outline"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
