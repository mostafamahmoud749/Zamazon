"use client"
import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa";

export default function SigninWithGithub(){
    return(
    <button onClick={()=>signIn("github",{redirect:true,callbackUrl:"/"})} className="cursor-pointer flex items-center gap-2 border p-2 rounded">
        <FaGithub size={22} /> Sign in with GitHub
    </button>
    )
}