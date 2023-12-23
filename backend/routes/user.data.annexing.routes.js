import express from "express"
import { addQuestion, addResponseToQuestion, likeResponseOfQuestion } from "../controllers/user.data.annexing.controller.js"


const router = express.Router();

router.post('/question/:userId', addQuestion)
router.post('/new_answer/:subjectId/:questionId/:userId', addResponseToQuestion)
router.post('/answer_update_like/:subjectId/:questionId/:answerId/:userId', likeResponseOfQuestion)

export default router;