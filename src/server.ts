import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { Pool } from "pg";

const app = express();
const port = 5000;

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
};

dotenv.config({ path: path.join(process.cwd(), ".env") });
app.use(express.json());
app.use(logger);

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
    description TEXT,
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

//? USERS CRUD

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO users(name, email) VALUES($1, $2) RETURNING *
      `,
      [name, email]
    );

    res.send({
      success: false,
      message: "User created successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    res.send({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
      `
      UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *
      `,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully!",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

//? TODOS CRUD

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *
      `,
      [user_id, title]
    );

    res.send({
      success: false,
      message: "Todos created successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    res.send({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: "Todos retrieved successfully!",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found!",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo retrieved successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const result = await pool.query(
      `
      UPDATE todos SET title=$1 WHERE id=$2 RETURNING *
      `,
      [title, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found!",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found!",
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todo deleted successfully!",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

//? NOT FOUND ROUTE
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Express-PostgreSQL-CRUD server is running on port: ${port}`);
});
