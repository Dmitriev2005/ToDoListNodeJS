import express from "express"
import {getIndex, postAuthorisation, getAuthorisation, getTasks,getAddNewTask, postAddNewTask, 
    getDeleteCookie,postEditTasks,getEditTasks,getRegistration,postCheckEmail,postCheckCode} from "../controllers/controller.js"
const router = express.Router()

router.get("/",getIndex)
router.get("/get-tasks",getTasks)
router.get("/login",getAuthorisation)
router.post("/login",postAuthorisation)
router.get("/add-new",getAddNewTask)
router.post("/add-new",postAddNewTask)

router.get("/delete-cookie", getDeleteCookie)
router.post("/post-edit-tasks", postEditTasks)
router.get("/get-edit-tasks", getEditTasks)

router.get("/registration", getRegistration)
router.post("/post-email", postCheckEmail)

router.post("/post-check-code", postCheckCode)
export const exportRouter = router