"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_1 = require("express");
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs")); // ✅ Fixed Import
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("🔍 Login attempt:", username);
        // Check if user exists
        const user = await user_1.User.findOne({ where: { username } });
        if (!user) {
            console.log("❌ User not found:", username);
            return res.status(401).json({ message: "Invalid username or password" });
        }
        console.log("✅ User found:", user.username);
        console.log("🔑 Stored password hash:", user.password);
        // Compare password
        const isMatch = bcryptjs_1.default.compareSync(password, user.password); // ✅ Use Sync version for consistency
        console.log("🔎 Password match result:", isMatch);
        if (!isMatch) {
            console.log("❌ Password did not match!");
            return res.status(401).json({ message: "Invalid username or password" });
        }
        // Generate JWT token
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ username: user.username }, secret, { expiresIn: "1h" });
        console.log("🎉 Login successful! Token generated.");
        return res.json({ token });
    }
    catch (error) {
        console.error("❌ Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const router = (0, express_1.Router)();
// POST /login - Login a user
router.post("/login", exports.login);
exports.default = router;
