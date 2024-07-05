import express from 'express'
import {questions} from "../../controllers/user/user.retrieve.controller.js"


const router = express.Router();

router.post('/questions/:userId', questions);

export default router;