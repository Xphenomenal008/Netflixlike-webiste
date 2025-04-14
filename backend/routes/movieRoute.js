import express from 'express'
import { getmoviebycategory, getmoviedetail, getsimilermovie, gettrailer, getTrendingMovies } from '../controller/movie_controller.js';
const router=express.Router()
router.get("/trending",getTrendingMovies)
router.get("/:id/trailers",gettrailer)
router.get("/:id/moviedetail",getmoviedetail)
router.get("/:id/similer",getsimilermovie)
router.get("/:category",getmoviebycategory)

export default router;
