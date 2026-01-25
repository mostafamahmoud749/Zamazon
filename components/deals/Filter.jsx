'use client';
import Stars from '@/components/deals/Stars';

export default function Filter({ name, toggle, value }) {
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
        className={`md:border-none md:bg-white ${
          value ? 'border-2 border-blue-600 bg-sky-100 font-bold' : 'border-1 border-gray-500'
        } rounded-xl px-2 py-1 md:my-2`}
      >
        {name === '4_up' ? <Stars text="& up" /> : name}
      </div>
    </div>
  );
}
