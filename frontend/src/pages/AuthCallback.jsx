import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.location.replace("/account");
      return;
    }
    navigate("/login");
  }, [params, navigate]);

  return <div className="mx-auto max-w-4xl px-6 py-12">Redirecting...</div>;
};

export default AuthCallback;
