import { useEffect } from "react";

function useShortPolling(cb, interval = 5000, ...cbArgs) {

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("short polling...");
      cb(...cbArgs);
    }, interval);

    return () => {
      clearInterval(intervalId)
    };
  }, [interval, cb, cbArgs]);
}

export default useShortPolling;
