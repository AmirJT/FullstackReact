import { Router, Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // ✅ Fixed Import
import dotenv from "dotenv";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log("🔍 Login attempt:", username);

    // Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    console.log("✅ User found:", user.username);
    console.log("🔑 Stored password hash:", user.password);

    // Compare password
    const isMatch = bcrypt.compareSync(password, user.password); // ✅ Use Sync version for consistency
    console.log("🔎 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password did not match!");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ username: user.username }, secret, { expiresIn: "1h" });

    console.log("🎉 Login successful! Token generated.");
    return res.json({ token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const router = Router();

// POST /login - Login a user
router.post("/login", login);

export default router;