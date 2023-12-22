import express from "express";
import { test, SignUp, SignIn, googleSignIn, SignOut } from "../controllers/auth.controller.js";
import signInVia from "../utils/signInVia.js";

const router = express.Router();

router.use('/test', test);
router.post('/sign_up', SignUp );
router.post('/sign_in', signInVia ,SignIn);
router.post('/sign_in/google', googleSignIn);
router.get('/sign_out', SignOut);


export default router;