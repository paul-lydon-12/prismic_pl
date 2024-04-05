import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const cb = () => savedCallback.current?.();

    // clear interval by passing null to useInterval
    // example useInterval(callback, condition ? 1000 : null);
    if (delay !== null) {
      const id = setInterval(cb, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
