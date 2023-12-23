import express from 'express'
import {questions} from "../controllers/user.retrieve.controller.js"


const router = express.Router();

router.get('/questions/:userId', questions);

export default router;