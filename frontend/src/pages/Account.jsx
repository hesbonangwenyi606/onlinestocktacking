import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const Account = () => {
  const { user, refresh } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", password: "" });
  const [addressForm, setAddressForm] = useState({ label: "Home", line1: "", line2: "", city: "", state: "", postal: "", country: "", phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      const [orderRes, addressRes] = await Promise.all([
        api.get("/orders/mine"),
        api.get("/users/me/addresses")
      ]);
      setOrders(orderRes.data);
      setAddresses(addressRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const updateProfile = async (event) => {
    event.preventDefault();
    await api.put("/users/me", form);
    refresh();
  };

  const addAddress = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/users/me/addresses", addressForm);
    setAddresses((prev) => [...prev, data]);
    setAddressForm({ label: "Home", line1: "", line2: "", city: "", state: "", postal: "", country: "", phone: "" });
  };

  const removeAddress = async (id) => {
    await api.delete(`/users/me/addresses/${id}`);
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="font-display text-3xl">Sign in required</h1>
        <p className="mt-2 text-ink/70 dark:text-white/70">Log in to view your orders and addresses.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl">Account</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <form className="mt-4 space-y-3" onSubmit={updateProfile}>
            <input className="input" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <input className="input" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <input className="input" type="password" placeholder="New password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <button className="btn-primary" type="submit">Update profile</button>
          </form>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Addresses</h2>
          <div className="mt-4 space-y-2">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-2xl border border-ink/10 p-3 text-sm">
                <p className="font-semibold">{address.label}</p>
                <p>{address.line1}</p>
                <p>{address.city}, {address.state} {address.postal}</p>
                <button className="text-xs text-red-500" onClick={() => removeAddress(address.id)}>Remove</button>
              </div>
            ))}
          </div>
          <form className="mt-4 space-y-3" onSubmit={addAddress}>
            <input className="input" placeholder="Label" value={addressForm.label} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} />
            <input className="input" placeholder="Line 1" value={addressForm.line1} onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })} />
            <input className="input" placeholder="Line 2" value={addressForm.line2} onChange={(event) => setAddressForm({ ...addressForm, line2: event.target.value })} />
            <div className="grid gap-2 md:grid-cols-2">
              <input className="input" placeholder="City" value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} />
              <input className="input" placeholder="State" value={addressForm.state} onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })} />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <input className="input" placeholder="Postal" value={addressForm.postal} onChange={(event) => setAddressForm({ ...addressForm, postal: event.target.value })} />
              <input className="input" placeholder="Country" value={addressForm.country} onChange={(event) => setAddressForm({ ...addressForm, country: event.target.value })} />
            </div>
            <input className="input" placeholder="Phone" value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} />
            <button className="btn-primary" type="submit">Add address</button>
          </form>
        </div>
      </div>
      <div className="mt-10 card p-6">
        <h2 className="text-lg font-semibold">Order history</h2>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-ink/10 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Order #{order.id.slice(0, 8)}</span>
                <span className="text-xs uppercase">{order.status}</span>
              </div>
              <p className="text-ink/60 dark:text-white/60">Total: ${Number(order.totalPrice).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
