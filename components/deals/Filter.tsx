'use client';
import Stars from '@/components/deal/Stars';

type FilterProps = {
  name: string;
  toggle: (name: string) => void;
  value: boolean;
};

export default function Filter({ name, toggle, value }: FilterProps) {
  return (
    <div className="group flex cursor-pointer items-center gap-1" onClick={() => toggle(name)}>
      <div
        className={`hidden transition-all duration-200 md:block md:h-5 md:w-5 md:rounded-full ${
          value
            ? 'md:border-7 md:border-blue-800'
            : 'md:border-1 md:border-gray-500 group-hover:md:border-5 group-hover:md:border-blue-600 group-hover:md:bg-sky-100'
        }`}
      ></div>
      <div
        className={`transition-all duration-200 md:border-none md:bg-white group-hover:md:ml-1 ${
          value ? 'border-2 border-blue-600 bg-sky-100 font-bold' : 'border-1 border-gray-500'
        } rounded-xl px-2 py-1 md:my-2`}
      >
        {name === '4_up' ? (
          <div className="flex items-center whitespace-nowrap text-yellow-500">
            <Stars big={true} />
            <span className="ml-1 text-black">&up</span>
          </div>
        ) : (
          name
        )}
      </div>
    </div>
  );
}
