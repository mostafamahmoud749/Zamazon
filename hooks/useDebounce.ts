import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debounceValue,setDebounceValue] = useState<T>(value)

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setDebounceValue(value)
    },delay)

    return () => clearTimeout(timeout)
  },[value,delay])

  return debounceValue
};
