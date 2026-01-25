"use client"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";

export default function SigninWithGoogle(){
    return(
    <button onClick={()=>signIn("google",{redirect:true,callbackUrl:"/"})} className="cursor-pointer flex items-center gap-2 border p-2 rounded">
        <FcGoogle size={22} /> Sign in with Google
    </button>
    )
}