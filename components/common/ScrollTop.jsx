"use client";
import { useState, useEffect } from "react";
export default function ScrollTop() {
  const [visible, setVisible] = useState(false);
  const checkY = () => {
    if (window.scrollY > 200) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkY);
    return () => window.removeEventListener("scroll", checkY);
  }, []);

  return visible ? (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="cursor-pointer text-white text-center py-2 bg-light_blue w-full"
    >
      Back to top
    </div>
  ) : null;
}
