import { json } from "sequelize"
import {UserTable,TaskTable} from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import nodemailer from "nodemailer"
import {randomNumber} from "../helper/forServer.js"
import NodeCache from "node-cache"
let secretWord = 'very_secret'
let cache = new NodeCache()
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
    const token = jwt.sign(userAuthourisation,secretWord)
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
export const getEditTasks = (req,res) =>{
  const sendToEdit = req.body
  const user = shortCut(req)
  if(typeof user === "object"){
    res.status(200).render("./pages/edit-task",{title:"Authorisation", user, sendToEdit})
  }
  else{
    res.status(403).send("Not authorisation")
  }
}
export const postEditTasks = async(req,res)=>{
  const user = shortCut(req)
  
  if(typeof user === "object"){
    const editTask = req.body
    const searchElement = await TaskTable.findOne({where:{
      id_task:editTask.id
    }})
    
    searchElement.title_task = editTask.title
    searchElement.describe_task = editTask.describe
    searchElement.data_completion_task = editTask.dataCompletion
    searchElement.save()

    res.status(200).send("task edit!")
  }
  else{
    res.status(403).send("Not authorisation")
  }
}
export const getRegistration = (req,res)=>{
  const user = shortCut(req)
  res.status(200).render("./pages/registration",{title:"Регистрация", user})
}
export const postCheckEmail = (req,res)=>{
  const user = req.body
  const rnd = randomNumber()
  const transporter = nodemailer.createTransport({
    host: 'mail.malojhomelab.ru',
    port: 587,
    auth:{
      user:'artyom@malojhomelab.ru',
      pass:`yfWThPtr"jK;G2"`
    }
  })
  const mailOptions = {
    from:'artyom@malojhomelab.ru',
    to:user.login,
    subject:'Подтверждение почты',
    text:'Код для подтверждения почты',
    html:`<b>${rnd}</b>`
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  })
  cache.set("checkCode",rnd,100)
  res.status(200).send("email")
}
export const postCheckCode = async(req,res)=>{
  const user = req.body
  if(user.checkCode===cache.get("checkCode")){
    const responseDB = await UserTable.create({
      login:user.login,
      password:user.password
    })
    if(!responseDB.isNewRecord)
      res.status(200).send("Пользователь добавлен!")
    else
      res.status(500).send("Пользователь не добавлен!")
  }else{
    res.status(400).send("Неправильный код!")
  }
}