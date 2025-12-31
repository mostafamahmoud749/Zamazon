"use client"

import { signOut } from "next-auth/react";

export default function Signout() {
    return <button className="cursor-pointer w-full text-start" onClick={()=>signOut()}>Signout</button>
}