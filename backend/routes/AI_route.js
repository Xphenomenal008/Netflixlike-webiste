import express from "express";
import  ai_summery  from "../controller/ai_controller.js";
const router=express.Router()
router.post("/",ai_summery)
export default router
