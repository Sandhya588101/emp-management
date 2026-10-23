
import { Router } from "express";
import { register, login, currentUser } from "./controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, currentUser);

export default router;
