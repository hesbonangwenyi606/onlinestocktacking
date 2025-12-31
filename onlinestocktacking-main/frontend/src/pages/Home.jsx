import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get("/products?limit=4"),
          api.get("/categories")
        ]);
        setProducts(productRes.data.items);
        setCategories(categoryRes.data);
      } catch {
        setError("Unable to load storefront data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Helmet>
        <title>OnlineStocktacking | Home</title>
        <meta name="description" content="Discover featured products, curated essentials, and trending categories." />
      </Helmet>
      <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Curated E-commerce</p>
          <h1 className="font-display text-4xl md:text-5xl">Build a store your customers obsess over.</h1>
          <p className="text-lg text-ink/70 dark:text-white/70">
            Experience premium merchandising, rapid checkout, and a brand-ready interface designed for growth.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products" className="btn-primary">Shop the collection</Link>
            <Link to="/account" className="btn-outline">Your account</Link>
          </div>
          <div className="grid gap-4 rounded-3xl border border-ink/10 bg-white/70 p-6 md:grid-cols-3">
            {["Fast Fulfillment", "Global Payments", "Smart Analytics"].map((item) => (
              <div key={item}>
                <p className="text-sm font-semibold">{item}</p>
                <p className="text-xs text-ink/60 dark:text-white/60">Ready for scale and secure operations.</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="card relative overflow-hidden p-6">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop"
              alt="Lifestyle"
              className="h-72 w-full rounded-3xl object-cover"
            />
            <div className="mt-6 grid gap-3">
              <p className="text-sm uppercase tracking-[0.2em] text-ink/50 dark:text-white/50">Trend Report</p>
              <h2 className="font-display text-2xl">The 2024 essentials drop</h2>
              <p className="text-sm text-ink/70 dark:text-white/70">Elevated basics engineered for daily rituals.</p>
              <Link to="/products" className="btn-primary">Explore new arrivals</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Featured products</h2>
          <Link to="/products" className="text-sm text-accent">View all</Link>
        </div>
        {loading && <div className="mt-6"><Loader /></div>}
        {error && <div className="mt-6"><ErrorState message={error} /></div>}
        {!loading && !error && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl">Top categories</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="card flex items-center justify-between p-6"
            >
              <div>
                <p className="text-sm uppercase tracking-widest text-ink/50 dark:text-white/50">Category</p>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-xs text-ink/60 dark:text-white/60">{category.description || "Curated picks"}</p>
              </div>
              <span className="text-2xl">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
