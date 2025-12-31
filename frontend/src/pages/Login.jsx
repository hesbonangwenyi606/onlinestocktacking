import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (isRegister) {
      await register(form);
    } else {
      await login(form.email, form.password);
    }
    navigate("/account");
  };

  const authBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-display text-3xl">{isRegister ? "Create account" : "Welcome back"}</h1>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        {isRegister && (
          <input className="input" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        )}
        <input className="input" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="btn-primary w-full" type="submit">
          {isRegister ? "Create account" : "Sign in"}
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <button className="text-accent" onClick={() => setIsRegister((prev) => !prev)}>
          {isRegister ? "Have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
      <div className="mt-6 grid gap-3">
        <a className="btn-outline" href={`${authBase}/auth/google`}>Continue with Google</a>
        <a className="btn-outline" href={`${authBase}/auth/facebook`}>Continue with Facebook</a>
        <a className="btn-outline" href={`${authBase}/auth/twitter`}>Continue with Twitter</a>
      </div>
    </div>
  );
};

export default Login;
