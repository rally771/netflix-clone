import {create} from "zustand"
import axios from "axios"
import toast from "react-hot-toast"
export const useAuthStore = create((set)=>({
    user:null,
    signup: async (credentials)=>{
        set({isSigningUp:true})
        try {
            const response = await axios.post("/api/v1/signup",credentials)
            set({user:response.data.user,isSigningUp:false})
            toast.success("Account Created Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || "An error occured")
            set({isSigningUp:false,user:null})
        }
    },
    login: async ()=>{
        
    },
    logout: async ()=>{
        
    },
    authCheck: async ()=>{
        
    }
}))