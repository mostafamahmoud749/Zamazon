import Link from 'next/link';
import {JSX} from "react"

export default function Logo ():JSX.Element{
  return(
    <Link href="/" className="ml-2 text-xl font-bold">
      zamazon
    </Link>
  )
}