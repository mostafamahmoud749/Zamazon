import {ReactNode} from "react"

type ButtonProps={
  color:string
  hoverdColor:string
  children:ReactNode
  padding:string
  onClick:()=>void
  disabled:boolean
  extraStyling:string
  margin:string
  rounded:string,
}

export default function Button({
  color,
  hoverdColor,
  children,
  padding="py-1",
  onClick,
  disabled = false,
  extraStyling,
  margin="my-2",
  rounded="rounded-3xl",
}:Partial<ButtonProps>) {

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        rounded,
        extraStyling,
        margin,
        padding,
        color,
        !disabled ? hoverdColor : '',
        'w-full  text-center transition-all duration-200',
        disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
