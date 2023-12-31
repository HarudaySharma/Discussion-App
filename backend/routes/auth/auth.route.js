import express from "express";
import { test, SignUp, SignIn, googleSignIn, SignOut } from "../../controllers/auth/auth.controller.js";
import signInVia from "../../utils/users/signInVia.js";

const router = express.Router();

router.use('/test', test);
router.post('/sign_up', SignUp );
router.post('/sign_in', signInVia ,SignIn);
router.post('/sign_in/google', googleSignIn);
router.post('/sign_out', SignOut);


export default router;