import express from "express"
import { updateUserCredentials , updateUserQuestion} from "../controllers/user.update.controller.js";

const router = express.Router();

router.post('/cred/:id', updateUserCredentials)
router.put('/question/:subjectId/:questionId/:userId', updateUserQuestion)
export default router;