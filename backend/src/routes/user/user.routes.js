import express from "express";
import userDataAnnexing from "./user.data.annexing.routes.js"
import userUpdate from './user.update.routes.js'
import userDataRetrieve from  './user.retrieve.routes.js'
import { test } from "../../controllers/user/user.controller.js";
import verifyToken from "../../utils/users/verifyToken.js"

const router = express.Router();

router.use('/test', test)

//for getting all the information inserted by user in the db
router.use('/retrieve/', verifyToken, userDataRetrieve) 

// for updating user related information
router.use('/update', verifyToken, userUpdate)

//user annexing data into the database
router.use('/annexing', verifyToken, userDataAnnexing)

export default router;