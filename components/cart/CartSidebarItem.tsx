import {ReactNode} from "react"

type CartSidebarItemProps = {
    children:ReactNode
}
export default function CartSidebarItem({children}:CartSidebarItemProps){
    return(
        <div className="flex items-center flex-col py-2 px-2 border-b-1 border-b-gray-300">
            {children}
        </div>
    )
}