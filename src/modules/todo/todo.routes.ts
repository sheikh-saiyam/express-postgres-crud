import express from "express";
import { todoControllers } from "./todo.controller";

const router = express.Router();

router.post("/", todoControllers.createTodo);

router.get("/", todoControllers.getTodos);

router.get("/:id", todoControllers.getTodoById);

router.put("/:id", todoControllers.updateTodo);

router.delete("/:id", todoControllers.deleteTodo);

export const todoRoutes = router;
