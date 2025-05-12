import { Request, Response } from "express";
import { adminLogin } from "../services/adminLoginService";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { token } = await adminLogin({ username, password });
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
