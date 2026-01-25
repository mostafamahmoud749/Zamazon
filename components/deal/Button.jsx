export default function Button({color,text}) {
  return(
    <div className={`${color} cursor-pointer w-full py-2 text-center rounded-3xl my-3`} >
      {text}
    </div>
  )
}