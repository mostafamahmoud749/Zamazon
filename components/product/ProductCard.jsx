import Image from "next/image";
import Link from "next/link"

export default function ProductCard({el}) {
  return(
    <Link
      href={`/deals/${el.id}`}
      className="bg-gray-100 w-full h-80 rounded-md shadow-md p-2 hover:shadow-lg transition flex flex-col items-center justify-between"
    >
      <div className="h-56 flex items-center justify-center w-full">
        <Image
          src={el.image}
          width={500}
          height={500}
          alt={el.title}
          className="max-h-full object-contain"
        />
      </div>
      <p className="text-center text-sm font-medium text-gray-700">{el.title}</p>
    </Link>
  )
}