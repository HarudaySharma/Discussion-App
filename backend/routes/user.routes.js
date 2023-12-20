import express from "express";
import { test , AddQuestion} from "../controllers/user.controller.js";

const router = express.Router();

router.use('/test', test)
router.post('/subject/questionAdd', AddQuestion)

export default router;