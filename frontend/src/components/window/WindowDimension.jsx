import { useState, useEffect } from "react";

function getWindowDims() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

export default function useWindowDims() {
  const [windowDims, setWindowDims] = useState(getWindowDims());

  useEffect(() => {
    function handleWindowResize() {
      setWindowDims(getWindowDims);
    }

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return windowDims;
}
