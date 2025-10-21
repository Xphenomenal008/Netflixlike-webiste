import express from 'express';
import { removeitemfromSearchHistory, searchmovie, searchperson, searchtv ,getSearchHistory,addToSearchHistory  } from '../controller/search_controller.js';
 
const router=express.Router()

router.get("/person/:query",searchperson)
router.get("/movie/:query",searchmovie)
router.get("/tv/:query",searchtv)
router.delete("/searchhistsorydelete/:id",removeitemfromSearchHistory)
router.get("/history", getSearchHistory);
router.post("/addhistory", addToSearchHistory);

export default router