import Link from "next/link"

export default function SignHeader(){
  return (
    <header className="bg-dark_blue p-2 text-white md:text-black md:text-center md:bg-white md:my-6 ">
      <Link href="/" className="font-bold text-xl md:text-3xl">
        Zamazon
      </Link>
    </header>
  )
}