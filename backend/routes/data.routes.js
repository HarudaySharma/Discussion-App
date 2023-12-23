import express from "express";
import { allData } from "../controllers/data.controller.js";

const router = express.Router();

router.get('/all_available', allData);

export default router;

