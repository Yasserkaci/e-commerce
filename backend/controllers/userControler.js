import User from "../models/userModel.js";
import asyncHandler from '../middlewares/asyncHandler.js'

const creatUser = asyncHandler(async (req, res) =>{
    res.send("hello")
})

export {creatUser} 
