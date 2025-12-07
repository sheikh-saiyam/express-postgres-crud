import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { userRoutes } from "./modules/user/user.routes";

const app = express();

app.use(express.json());
app.use(logger);

initDB();

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello from Express-PostgreSQL-CRUD server");
});

//* ROUTES
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

//* NOT FOUND ROUTE
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

export default app;
