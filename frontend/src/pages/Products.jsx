import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = params.toString();
      const { data } = await api.get(`/products?${query}`);
      setItems(data.items);
      setPagination(data.pagination);
    } catch {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await api.get("/categories");
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [params]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  const onPageChange = (page) => {
    const next = new URLSearchParams(params);
    next.set("page", page);
    setParams(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Helmet>
        <title>Shop | OnlineStocktacking</title>
      </Helmet>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full max-w-xs space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <label className="mt-4 block text-xs uppercase tracking-widest">Category</label>
            <select
              className="input mt-2"
              value={params.get("category") || ""}
              onChange={(event) => updateParam("category", event.target.value)}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            <label className="mt-4 block text-xs uppercase tracking-widest">Price range</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                className="input"
                type="number"
                placeholder="Min"
                value={params.get("minPrice") || ""}
                onChange={(event) => updateParam("minPrice", event.target.value)}
              />
              <input
                className="input"
                type="number"
                placeholder="Max"
                value={params.get("maxPrice") || ""}
                onChange={(event) => updateParam("maxPrice", event.target.value)}
              />
            </div>

            <label className="mt-4 block text-xs uppercase tracking-widest">Rating</label>
            <select
              className="input mt-2"
              value={params.get("rating") || ""}
              onChange={(event) => updateParam("rating", event.target.value)}
            >
              <option value="">All</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
            </select>
          </div>
        </aside>

        <section className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl">Shop all</h1>
          </div>
          {loading && <div className="mt-6"><Loader /></div>}
          {error && <div className="mt-6"><ErrorState message={error} /></div>}
          {!loading && !error && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-8">
            <Pagination page={pagination.page} pages={pagination.pages} onChange={onPageChange} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;
