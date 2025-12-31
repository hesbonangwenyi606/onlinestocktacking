import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import Rating from "../components/Rating";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch {
      setError("Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) return;
    await api.post(`/products/${id}/reviews`, review);
    setReview({ rating: 5, comment: "" });
    fetchProduct();
  };

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-12"><Loader /></div>;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-12"><ErrorState message={error} /></div>;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Helmet>
        <title>{product.name} | OnlineStocktacking</title>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <img
            src={product.images?.[0] || "https://placehold.co/600x500"}
            alt={product.name}
            className="w-full rounded-3xl object-cover"
          />
          <div className="grid grid-cols-3 gap-3">
            {product.images?.slice(1, 4).map((image) => (
              <img key={image} src={image} alt={product.name} className="h-24 w-full rounded-2xl object-cover" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-widest text-accent">{product.category?.name || "Essentials"}</p>
          <h1 className="font-display text-3xl">{product.name}</h1>
          <Rating value={product.rating || 0} />
          <p className="text-lg text-ink/70 dark:text-white/70">{product.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">${Number(product.price).toFixed(2)}</span>
            <span className="text-sm text-ink/50 dark:text-white/60">Stock: {product.stock}</span>
          </div>
          <button className="btn-primary" onClick={() => addToCart(product, 1)}>
            Add to cart
          </button>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Reviews</h3>
            <div className="mt-4 space-y-4">
              {product.reviews?.length ? (
                product.reviews.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-ink/10 p-4">
                    <p className="text-sm font-semibold">{item.user?.name}</p>
                    <Rating value={item.rating} />
                    <p className="text-sm text-ink/70 dark:text-white/70">{item.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/60 dark:text-white/60">No reviews yet.</p>
              )}
            </div>
            {user && (
              <form className="mt-6 space-y-3" onSubmit={submitReview}>
                <label className="text-xs uppercase tracking-widest">Rating</label>
                <select
                  className="input"
                  value={review.rating}
                  onChange={(event) => setReview((prev) => ({ ...prev, rating: event.target.value }))}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <textarea
                  className="input"
                  rows="3"
                  placeholder="Share your experience"
                  value={review.comment}
                  onChange={(event) => setReview((prev) => ({ ...prev, comment: event.target.value }))}
                />
                <button className="btn-primary" type="submit">Submit review</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
