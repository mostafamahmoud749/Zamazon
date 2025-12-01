export default function Radio({ text, textq, toggle, selected }) {
  return (
    <div
      onClick={() => toggle(selected)}
      className={`cursor-pointer p-4 flex items-center gap-6 ${!selected ? "bg-gray" : ""}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white border-6 ${
          selected ? "border-sky-700" : "border-transparent"
        }  ring-1 ring-gray-700`}
      ></div>
      <div className="text-sm font-bold">
        {text}
        <span
          className={`transition-all duration-300 ml-1  ${
            selected ? "font-bold text-md" : "font-medium text-xs"
          }`}
        >
          {textq}
        </span>
      </div>
    </div>
  );
}
