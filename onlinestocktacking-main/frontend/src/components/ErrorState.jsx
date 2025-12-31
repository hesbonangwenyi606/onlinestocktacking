import React from "react";

const ErrorState = ({ message }) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
    {message}
  </div>
);

export default ErrorState;
