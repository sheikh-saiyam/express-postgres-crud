import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Pool } from "pg";

const app = express();
const port = 5000;

dotenv.config();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT, 
    created_At TIMESTAMP DEFAULT NOW(),
    updated_At TIMESTAMP DEFAULT NOW()
    )
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_At TIMESTAMP DEFAULT NOW(),
    updated_At TIMESTAMP DEFAULT NOW()
    )
    `);
};
initDB();

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello from Express-PostgreSQL-CRUD server");
});

app.listen(port, () => {
  console.log(`Express-PostgreSQL-CRUD server is running on port: ${port}`);
});
