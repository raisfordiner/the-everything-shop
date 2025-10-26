import { Request, Response } from "express";
  import { CreateUserDto } from "../dto/user";
import { forgotPasswordService, loginUserService, registerUserService } from "../services/auth.service";

export async function registerUser (req: Request, res: Response): Promise<void> {
  try {
    const createdUser = await registerUserService(req.body as CreateUserDto);
    res.status(200).json(createdUser);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export async function loginUser (req: Request, res: Response): Promise<void> {
  try {
    const {email, password} = req.body;
    const {token} = await loginUserService(email, password);
    res.status(200).json({token});
  } catch (error: any) {
    res.status(401).json({error: error.message});
  }
}

export async function forgotPassword (req: Request, res: Response): Promise<void> {
  try {
    const {email} = req.body;
    await forgotPasswordService(email);
    res.status(200).json({message: "Password reset email sent"});
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}