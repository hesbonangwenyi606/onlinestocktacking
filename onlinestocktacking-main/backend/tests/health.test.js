import request from "supertest";
import app from "../src/app.js";

describe("Health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
