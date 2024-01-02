import express from "express";
import { allData } from "../../controllers/data/data.controller.js";

const router = express.Router();

router.post('/all_available', allData);

export default router;

