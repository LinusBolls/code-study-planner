"use client";

import { useState, useEffect } from "react";

const isPrerender = typeof window === "undefined";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: isPrerender ? 0 : window.innerWidth,
    height: isPrerender ? 0 : window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = screenSize.width < 768;

  return {
    isMobile,
  };
};
export default useScreenSize;
