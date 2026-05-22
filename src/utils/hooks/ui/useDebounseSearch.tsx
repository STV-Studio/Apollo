import { useEffect, useState } from "react";

interface Props<T> {
  deley: number;
  value: T;
}
export function useDebounseSearch<T>({ value, deley }: Props<T>) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const hendler = setTimeout(() => {
      setDebouncedValue(value);
    }, deley);
    return () => clearTimeout(hendler);
  }, [value, deley]);

  return debouncedValue;
}
