import Link from "next/link"

export default function SignLink() {
    return(
        <div className="text-center my-2">
            <Link href="/signin" className="bg-yellow hover:bg-yellow-400 py-1 px-3 m-auto block w-40 mb-1 rounded-2xl">sign in</Link>
            <div className="text-xs ">New customer?<Link href="/signin" className="underline text-sky-700 hover:text-sky-900">Start here</Link></div>
        </div>
    )
}