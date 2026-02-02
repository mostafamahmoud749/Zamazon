import Link from "next/link"
import {JSX} from "react"

export default function SignHeader():JSX.Element {
  return (
    <header className="bg-dark_blue p-2 text-white md:text-black md:text-center md:bg-white md:my-6 ">
      <Link href="/" className="font-bold text-xl md:text-3xl">
        Zamazon
      </Link>
    </header>
  )
}