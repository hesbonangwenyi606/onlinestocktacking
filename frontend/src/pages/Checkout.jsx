import React, { useContext, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items, subtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    phone: ""
  });
  const [orderId, setOrderId] = useState(null);
  const [placing, setPlacing] = useState(false);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="font-display text-3xl">Checkout</h1>
        <p className="mt-2 text-ink/70 dark:text-white/70">Your cart is empty.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="font-display text-3xl">Sign in required</h1>
        <p className="mt-2 text-ink/70 dark:text-white/70">Create an account to complete checkout.</p>
      </div>
    );
  }

  const createLocalOrder = async () => {
    setPlacing(true);
    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: subtotal,
      shippingInfo: shipping
    };
    const { data } = await api.post("/orders", payload);
    setOrderId(data.id);
    setPlacing(false);
  };

  const handlePayPalCreateOrder = async () => {
    const { data } = await api.post("/payments/paypal/create-order", { total: subtotal });
    return data.id;
  };

  const handlePayPalApprove = async (data) => {
    await api.post("/payments/paypal/capture-order", { orderId: data.orderID, localOrderId: orderId });
    clearCart();
    navigate("/account");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Shipping information</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Full name" value={shipping.fullName} onChange={(event) => setShipping({ ...shipping, fullName: event.target.value })} />
            <input className="input" placeholder="Email" value={shipping.email} onChange={(event) => setShipping({ ...shipping, email: event.target.value })} />
            <input className="input md:col-span-2" placeholder="Address line 1" value={shipping.line1} onChange={(event) => setShipping({ ...shipping, line1: event.target.value })} />
            <input className="input md:col-span-2" placeholder="Address line 2" value={shipping.line2} onChange={(event) => setShipping({ ...shipping, line2: event.target.value })} />
            <input className="input" placeholder="City" value={shipping.city} onChange={(event) => setShipping({ ...shipping, city: event.target.value })} />
            <input className="input" placeholder="State" value={shipping.state} onChange={(event) => setShipping({ ...shipping, state: event.target.value })} />
            <input className="input" placeholder="Postal code" value={shipping.postal} onChange={(event) => setShipping({ ...shipping, postal: event.target.value })} />
            <input className="input" placeholder="Country" value={shipping.country} onChange={(event) => setShipping({ ...shipping, country: event.target.value })} />
            <input className="input md:col-span-2" placeholder="Phone" value={shipping.phone} onChange={(event) => setShipping({ ...shipping, phone: event.target.value })} />
          </div>
          <button className="btn-primary mt-6" onClick={createLocalOrder} disabled={placing}>
            {placing ? "Reserving..." : "Reserve order"}
          </button>
        </div>
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {orderId ? (
            <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test" }}>
              <PayPalButtons
                style={{ layout: "vertical", color: "gold" }}
                createOrder={handlePayPalCreateOrder}
                onApprove={handlePayPalApprove}
              />
            </PayPalScriptProvider>
          ) : (
            <p className="text-sm text-ink/60 dark:text-white/60">Reserve your order to enable PayPal checkout.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
