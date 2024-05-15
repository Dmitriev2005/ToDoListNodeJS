import express from "express"
import {getIndex, postAuthorisation, getAuthorisation, getTasks,getAddNewTask, postAddNewTask, getDeleteCookie} from "../controllers/controller.js"
const router = express.Router()

router.get("/",getIndex)
router.get("/get-tasks",getTasks)
router.get("/login",getAuthorisation)
router.post("/login",postAuthorisation)
router.get("/add-new",getAddNewTask)
router.post("/add-new",postAddNewTask)

router.get("/delete-cookie", getDeleteCookie)
export const exportRouter = router