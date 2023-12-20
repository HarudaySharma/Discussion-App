import express from "express";
import { test, SignUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.use('/test', test);
router.post('/sign_up', SignUp );

export default router;