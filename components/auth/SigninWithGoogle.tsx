"use client"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";
import {JSX} from "react"

export default function SigninWithGoogle():JSX.Element{
    return(
    <button onClick={()=>signIn("google",{redirect:true,callbackUrl:"/"})} className="cursor-pointer flex items-center gap-2 border p-2 rounded">
        <FcGoogle size={22} /> Sign in with Google
    </button>
    )
}