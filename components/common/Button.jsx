export default function Button({
  color,
  hoverdColor,
  children,
  padding="py-1",
  onClick,
  disabled = false,
  extraStyling,
  margin,
  rounded="rounded-3xl",
}) {

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
        'my-3 w-full  text-center transition-all duration-200',
        disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
