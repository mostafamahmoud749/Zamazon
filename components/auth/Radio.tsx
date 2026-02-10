import { AuthProps } from '@/types/auth';

export default function Radio({ text, textq, toggle, selected }: AuthProps) {
  return (
    <div
      onClick={() => toggle(selected)}
      className={`flex cursor-pointer items-center gap-6 p-4 ${!selected ? 'bg-gray' : ''}`}
    >
      <div
        className={`h-5 w-5 rounded-full border-6 bg-white ${
          selected ? 'border-sky-700' : 'border-transparent'
        } ring-1 ring-gray-700`}
      ></div>
      <div className="text-sm font-bold">
        {text}
        <span
          className={`ml-1 transition-all duration-300 ${
            selected ? 'text-md font-bold' : 'text-xs font-medium'
          }`}
        >
          {textq}
        </span>
      </div>
    </div>
  );
}
