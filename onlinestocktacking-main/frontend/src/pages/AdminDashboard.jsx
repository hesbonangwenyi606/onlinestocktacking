import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import Loader from "../components/Loader";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { AuthContext } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", stock: "", categoryId: "" });
  const [images, setImages] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  const fetchData = async () => {
    const [analyticsRes, productRes, categoryRes, orderRes, userRes] = await Promise.all([
      api.get("/admin/analytics"),
      api.get("/products?limit=20"),
      api.get("/categories"),
      api.get("/orders"),
      api.get("/users")
    ]);
    setAnalytics(analyticsRes.data);
    setProducts(productRes.data.items);
    setCategories(categoryRes.data);
    setOrders(orderRes.data);
    setUsers(userRes.data);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const createProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => formData.append(key, value));
    images.forEach((file) => formData.append("images", file));
    await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
    setProductForm({ name: "", description: "", price: "", stock: "", categoryId: "" });
    setImages([]);
    fetchData();
  };

  const createCategory = async (event) => {
    event.preventDefault();
    await api.post("/categories", categoryForm);
    setCategoryForm({ name: "", description: "" });
    fetchData();
  };

  const updateOrderStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    fetchData();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Loader />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="font-display text-3xl">Admin access required</h1>
        <p className="mt-2 text-ink/70 dark:text-white/70">Sign in with an admin account to manage the store.</p>
      </div>
    );
  }

  const salesData = {
    labels: analytics.salesByDay.map((item) => new Date(item.day).toLocaleDateString()),
    datasets: [
      {
        label: "Sales",
        data: analytics.salesByDay.map((item) => Number(item.total)),
        borderColor: "#ff6b35",
        backgroundColor: "rgba(255, 107, 53, 0.2)",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl">Admin dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs uppercase text-ink/50 dark:text-white/50">Total sales</p>
          <p className="text-2xl font-semibold">${analytics.totalSales.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink/50 dark:text-white/50">Orders</p>
          <p className="text-2xl font-semibold">{analytics.orderCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink/50 dark:text-white/50">Customers</p>
          <p className="text-2xl font-semibold">{analytics.userCount}</p>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <h2 className="text-lg font-semibold">Sales trend</h2>
        <Line data={salesData} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Create product</h2>
          <form className="mt-4 space-y-3" onSubmit={createProduct}>
            <input className="input" placeholder="Name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
            <textarea className="input" rows="3" placeholder="Description" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} />
            <div className="grid gap-2 md:grid-cols-2">
              <input className="input" type="number" placeholder="Price" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} />
              <input className="input" type="number" placeholder="Stock" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} />
            </div>
            <select className="input" value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input className="input" type="file" multiple onChange={(event) => setImages(Array.from(event.target.files))} />
            <button className="btn-primary" type="submit">Create product</button>
          </form>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Top products</h2>
          <div className="mt-4 space-y-3 text-sm">
            {analytics.topProducts.map((item) => (
              <div key={item.product?.id} className="flex items-center justify-between">
                <span>{item.product?.name}</span>
                <span>{item.quantity} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Manage categories</h2>
          <form className="mt-4 space-y-3" onSubmit={createCategory}>
            <input className="input" placeholder="Name" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} />
            <input className="input" placeholder="Description" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
            <button className="btn-primary" type="submit">Create category</button>
          </form>
          <div className="mt-4 space-y-2 text-sm">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-xs text-ink/60 dark:text-white/60">{category.description}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <div className="mt-4 space-y-3 text-sm">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-2">
                <span>#{order.id.slice(0, 8)}</span>
                <select
                  className="input max-w-[140px]"
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                >
                  {["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Users</h2>
          <div className="mt-4 space-y-3 text-sm">
            {users.slice(0, 6).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <span>{user.name}</span>
                <span className="text-xs uppercase">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
