'use client';
import { useState, useEffect } from 'react';

export default function ScrollTop() {
  const [visible, setVisible] = useState<boolean>(false);

  const checkY = (): void => {
    if (window.scrollY > 200) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkY);
    return (): void => window.removeEventListener('scroll', checkY);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="bg-light_blue w-full cursor-pointer py-2 text-center text-white"
    >
      Back to top
    </button>
  ) : (
    <></>
  );
}
