import express from 'express'
import {  } from '../controller/movie_controller.js';
import { getsimilertvshow, gettrailertvshow, getTrendingtvshow, gettvshowbycategory, gettvshowdetail } from '../controller/Tv_show_controller.js';
const router=express.Router()
router.get("/trending",getTrendingtvshow)
router.get("/:id/trailers",gettrailertvshow)
router.get("/:id/tvdetail",gettvshowdetail)
router.get("/:id/similer",getsimilertvshow)
router.get("/:category",gettvshowbycategory)

export default router;
