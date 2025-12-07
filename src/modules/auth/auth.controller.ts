import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authServices.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "User Login Successful!",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const authControllers = {
  loginUser,
};
