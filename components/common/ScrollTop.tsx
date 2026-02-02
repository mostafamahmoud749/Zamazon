"use client";
import { useState, useEffect } from "react";
import {JSX} from "react"


export default function ScrollTop():JSX.Element {

  const [visible, setVisible] = useState<boolean>(false);

  const checkY = ():void => {
    if (window.scrollY > 200) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkY);
    return ():void => window.removeEventListener("scroll", checkY);
  }, []);

  return visible ? (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="cursor-pointer text-white text-center py-2 bg-light_blue w-full"
    >
      Back to top
    </div>
  ) : <></>;
}
