import { json } from "sequelize"
import {UserTable,TaskTable} from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"

let secretWord = 'very_secret'

const verifyToken = (req) =>{
  let returnVerf = 403
  if("authorisation_token" in req.cookies){
    
    const tokenClient = req.cookies.authorisation_token
    if(tokenClient)
      jwt.verify(tokenClient,secretWord,(err,decoded)=>{
        if(err)
          returnVerf = 403
        else
          returnVerf =  decoded
      })
    return returnVerf
  }
  else
    return false
}
const shortCut = (req)=>{
  const buffer = verifyToken(req)
  let user
  if(buffer===403)
    user = 403
  else if(!buffer)
    user = "No authorisation"
  else 
    user = buffer
  
  return user
}
export const getIndex = (req,res) =>{
  const user = shortCut(req)
  res.render("./pages/index",{title:"Home", user})
}
export const getAuthorisation = (req,res)=>{
  const user = shortCut(req)
  res.render("./pages/authorisation",{title:"Authorisation", user})
  
}
export const postAuthorisation = async (req,res) =>{
  const userFromClient = req.body
  const responseDB = await UserTable.findOne({
    where:{
      login:userFromClient.login,
      password:userFromClient.password
    }
  })

  if(responseDB){
    const userAuthourisation = {
      id:responseDB.dataValues.id_user,
      login:responseDB.dataValues.login
    }
    const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
    res.cookie('authorisation_token',token,{httpOnly:true})
    res.status(200).send("You authorisation!")
  } 
  else
    res.status(403).send("There is no such user!")
}

export const getTasks = async(req,res) =>{
  const user = shortCut(req)
  if(typeof user === "object"){
    const responseDB = await TaskTable.findAll({
      where:{
        user_fk_id_task:user.id
      }
    })
    res.status(200).json(responseDB)
  }

}
export const getAddNewTask = (req,res)=>{
  const user = shortCut(req)
  if(typeof user === "object"){
    res.status(200).render("./pages/add-new",{title:"Add new task", user})
  }
  else{
    res.status(403).send("Not authorisation")
  }
}
export const postAddNewTask = (req,res) =>{
  const user = shortCut(req)
  const newTask = req.body
  if(typeof user === "object"){
    TaskTable.create({
      title_task:newTask.title,
      describe_task:newTask.describe,
      data_completion_task:newTask.dataCompletion,
      data_add_task:new Date(),
      user_fk_id_task:user.id

    }).then(res.status(200))
    
  }else{
    res.status(403).send("Error!")
  }
}
export const getDeleteCookie = (req,res) =>{
  res.status(200).clearCookie('authorisation_token')
  res.send("Exit!")
}