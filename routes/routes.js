import express from "express"
import {getIndex, postAuthorisation, getAuthorisation, getTasks,getAddNewTask, postAddNewTask} from "../controllers/controller.js"
const router = express.Router()

router.get("/",getIndex)
router.get("/get-tasks",getTasks)
router.get("/login",getAuthorisation)
router.post("/login",postAuthorisation)
router.get("/add-new",getAddNewTask)
router.post("/add-new",postAddNewTask)

export const exportRouter = router