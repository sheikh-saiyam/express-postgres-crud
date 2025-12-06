import { Request, Response } from "express";
import { pool } from "../../config/db";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoServices.createTodo(user_id, title);

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
};

const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodos();

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
};

const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await todoServices.getTodoById(id!);

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
};

const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const result = await todoServices.updateTodo(title, id!);

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
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await todoServices.deleteTodo(id!);

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
};

export const todoControllers = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
