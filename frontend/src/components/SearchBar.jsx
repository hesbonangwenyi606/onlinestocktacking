import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query) {
        setResults([]);
        return;
      }
      try {
        const { data } = await api.get(`/products/suggestions?q=${encodeURIComponent(query)}`);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => query && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="input"
        placeholder="Search for essentials..."
      />
      {open && results.length > 0 && (
        <div className="absolute top-12 z-20 w-full rounded-2xl border border-ink/10 bg-white/90 p-3 shadow-lg backdrop-blur">
          {results.map((item) => (
            <Link
              key={item.id}
              to={`/products/${item.id}`}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-ink/5"
            >
              <img
                src={item.images?.[0] || "https://placehold.co/64x64"}
                alt={item.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export defa
