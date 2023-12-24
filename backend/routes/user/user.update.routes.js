import express from "express"
import {
    updateUserCredentials, updateUserQuestion, updateUserAnswer,
    deleteUserQuestion, deleteUserAnswer
} from "../../controllers/user/user.update.controller.js";


const router = express.Router();

router.post('/cred/:id', updateUserCredentials);
router.put('/question/:subjectId/:questionId/:userId', updateUserQuestion);
router.patch('/answer/:subjectId/:questionId/:answerId/:userId', updateUserAnswer);
router.delete('/question/:subjectId/:questionId/:userId', deleteUserQuestion);
router.delete('/answer/:subjectId/:questionId/:answerId/:userId', deleteUserAnswer);

export default router;