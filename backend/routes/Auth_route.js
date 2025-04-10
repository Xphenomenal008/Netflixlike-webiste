import express from "express";
import { authcheck, login, logout, signup } from "../controller/auth_controller.js";
const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/authcheck",authcheck)

export default router