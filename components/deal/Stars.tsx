import {JSX} from "react"

type StarsProps ={
  value:number
  max:number
  big:boolean
}

export default function Stars({ value = 4, max = 5, big = false }:Partial<StarsProps>):JSX.Element {
  const fullStars:number = Math.floor(value);
  const partial:number = value - fullStars;
  const emptyStars:number = max - fullStars - (partial > 0 ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${big ? 'h-5 w-5' : 'h-4 w-4'} text-orange-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" />
        </svg>
      ))}
      {partial > 0 && (
        <svg className="h-4 w-4" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="partial-star" x1="0" x2="1" y1="0" y2="0">
              <stop offset={`${partial * 100}%`} stopColor="#fb923c" />
              <stop offset={`${partial * 100}%`} stopColor="#fff" />
            </linearGradient>
          </defs>
          <polygon
            points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36"
            fill="url(#partial-star)"
            stroke="#fb923c"
            strokeWidth="1"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${big ? 'h-5 w-5' : 'h-4 w-4'}`}
          fill="#fff"
          stroke="#fb923c"
          strokeWidth="1"
          viewBox="0 0 20 20"
        >
          <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" />
        </svg>
      ))}
    </div>
  );
}
