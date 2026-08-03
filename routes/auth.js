import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController.js";
import authGuard from "../middlewares/authGuard.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authGuard, getCurrentUser);

export default router;