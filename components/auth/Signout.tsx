"use client"

import { signOut } from "next-auth/react";
import {JSX} from "react"

export default function Signout():JSX.Element {
    return <button className="text-rose-700 cursor-pointer w-full text-start" onClick={()=>signOut()}>Signout</button>
}