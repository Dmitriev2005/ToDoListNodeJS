import express from "express"
import  {exportRouter} from "./routes/routes.js"
import cookieParser from "cookie-parser"
const app = express()

//const __dirname  = fileURLToPath(import.meta.url)
//app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs")
app.use(cookieParser())
app.use(express.json())
app.use(exportRouter)
app.listen(8000,()=>console.log("Server work..."))