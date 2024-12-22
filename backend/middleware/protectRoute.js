import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ENV_VARS } from "../config/envVars.js"

export const protectRoute = async (req,res,next)=>{

    try {
        const token = req.cookies["jwt-netflix"]
        console.log(token)
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorised/No token provided"})
        }

        const decoded = jwt.verify(token,ENV_VARS.JWT_SECRET)
        console.log("decoded",decoded)
        if(!decoded){
            return res.status(401).json({success:false,message:"Unauthorised/Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        console.log(user)
        if(!user){
            return res.status(401).json({success:false,message:"User not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in Protect Route ${error.message}`)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
