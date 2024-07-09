//Packages
import express from "express";
import path from "path";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js";

//utils
import connectdb from "./config/db.js";

const port = process.env.PORT || 8080;
const app = express()

connectdb()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/user", userRoutes)


app.listen(port, ()=> console.log(`Server Up listening to port: ${port}`))



