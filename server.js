import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import Stripe from "stripe";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.json({ status: "Duzyks Finance Running" });
});

app.post("/contractor", async (req, res) => {
  const { name, email } = req.body;

  const result = await pool.query(
    "INSERT INTO contractors (name,email,ytd_paid) VALUES ($1,$2,0) RETURNING *",
    [name, email]
  );

  res.json(result.rows[0]);
});

app.post("/payment", async (req, res) => {
  const { contractor_id, amount } = req.body;

  await pool.query(
     CREATE TABLE IF NOT EXISTS contractors (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    ytd_paid NUMERIC DEFAULT 0,
    tax_year INTEGER DEFAULT 2025,
    form_1099_required BOOLEAN DEFAULT FALSE
  );
  );

  res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
app.get("/test-create", async (req, res) => {
  const result = await pool.query(
    "INSERT INTO contractors (name,email,ytd_paid) VALUES ($1,$2,0) RETURNING *",
    ["Browser Test Contractor", "browser@test.com"]
  );

  res.json(result.rows[0]);
});
