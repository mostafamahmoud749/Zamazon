export default function Button({color,text,addToCart,product}) {
  return(
    <div className={`${color} cursor-pointer w-full py-2 text-center rounded-3xl my-3`} onClick={()=>addToCart(product)} >
      {text}
    </div>
  )
}