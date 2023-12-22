import express from "express";
import { test , updateUser, AddQuestion} from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyToken.js"

const router = express.Router();

router.use('/test', test)
router.post('/updatecred/:id', verifyToken, updateUser)
router.post('/subject/questionAdd', AddQuestion)

export default router;