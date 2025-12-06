import { pool } from "../../config/db";

const createTodo = async (user_id: string, title: string) => {
  const result = await pool.query(
    `
          INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *
          `,
    [user_id, title]
  );
  return result;
};

const getTodos = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};

const getTodoById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};

const updateTodo = async (title: string, id: string) => {
  const result = await pool.query(
    `
      UPDATE todos SET title=$1 WHERE id=$2 RETURNING *
      `,
    [title, id]
  );
  return result;
};

const deleteTodo = async (id: string) => {
  const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);
  return result;
};

export const todoServices = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
