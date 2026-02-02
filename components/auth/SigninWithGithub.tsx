"use client"
import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa";
import {JSX} from "react"

export default function SigninWithGithub():JSX.Element{
    return(
    <button onClick={()=>signIn("github",{redirect:true,callbackUrl:"/"})} className="cursor-pointer flex items-center gap-2 border p-2 rounded">
        <FaGithub size={22} /> Sign in with GitHub
    </button>
    )
}