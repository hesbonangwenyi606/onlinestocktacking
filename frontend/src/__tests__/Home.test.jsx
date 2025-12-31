import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import { HelmetProvider } from "react-helmet-async";

vi.mock("../api/api", () => ({
  default: {
    get: vi.fn((url) => {
      if (url.startsWith("/categories")) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: { items: [], pagination: {} } });
    })
  }
}));

const Wrapper = ({ children }) => (
  <HelmetProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </HelmetProvider>
);

describe("Home", () => {
  it("renders hero heading", async () => {
    render(<Home />, { wrapper: Wrapper });
    expect(screen.getByText(/build a store/i)).toBeInTheDocument();
  });
});
