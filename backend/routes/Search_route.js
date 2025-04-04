import express from 'express';
import { removeitemfromSearchHistory, searchmovie, searchperson, searchtv } from '../controller/search_controller.js';
const router=express.Router()

router.get("/person/:query",searchperson)
router.get("/movie/:query",searchmovie)
router.get("/tv/:query",searchtv)
router.get("/searchhistsorydelete/:id",removeitemfromSearchHistory)

export default router