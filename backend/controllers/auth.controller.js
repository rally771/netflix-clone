import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req,res) {
    try {
        const {email,password,username} = req.body
        if(!email || !password || !username){
            return res.status(400).json({success:false,message:"All Fields are required"})
        }

        const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        console.log(email , emailRegex.test(email))
        if(!emailRegex.test(email)){
            return res.status(400).json({success:false,message:"Invalid Email address"})
        }

        if(password.length < 6){
            return res.status(400).json({success:false,message:"Password must be atleast 6 characters"})
        }

        const existingUserByEmail = await User.findOne({email:email})

        if(existingUserByEmail){
            return res.status(400).json({success:false,message:"User with Email already exists"})
        }

        const existingUserByUsername = await User.findOne({username:username})

        if(existingUserByUsername){
            return res.status(400).json({success:false,message:"User with Username already exists"})
        }
        
        const PROFILE_PICS =["/avatar1.png","/avatar2.png","/avatar3.png"]
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt)
        const newUser = new User({
            email:email,
            password:hashedPassword,
            username:username
        })
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save()
        res.status(201).json({success:true,user:{
            ...newUser._doc,
            password:""
        }})
    } catch (error) {
        console.log("Error  in Signup Controller",error.message)
         res.status(500).json({success:false,message:"Internal Server Error"})

    }
}

export async function login(req,res) {
    try {
        const {email,password} = req.body
        console.log(req.body)
        if(!email || !password){
            return res.status(400).json({success:false,message:"All Fields Mandatory"})
        }
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({success:false,message:"Invalid Credentials"})
        }

        const isPasswordCorrect = await bcryptjs.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({success:false,message:"Invalid Credentials"})
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({success:true,user:{
            ...user._doc,
            password:""
        }})

    } catch (error) {
        
    }
}

export async function logout(req,res) {
    try {
        res.clearCookie("jwt-netflix")
        res.status(200).json({success:true,message:"Logged Out successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
