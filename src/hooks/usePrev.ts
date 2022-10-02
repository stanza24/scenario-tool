import { useRef, useEffect } from 'react';

export const usePrev = <V>(value: V) => {
  const ref = useRef<V>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
