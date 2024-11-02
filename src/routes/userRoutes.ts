import {Router} from "express"
import { createUser, deleteUser, getUsers, signIn, updateUser } from "../controllers/User"
import { rateLimitter } from "../middleware/rateLimiter"

const router = Router()

//Get user(s)
router.get("/", rateLimitter(30, 4) , getUsers)

//create users
router.post("/", createUser)

//update user
router.post("/updateUser", updateUser)

//delete user
router.post("/deleteUser", deleteUser)

//sign in users
router.post("/signin", signIn)

export default router