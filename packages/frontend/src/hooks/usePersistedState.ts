import { useEffect, useState } from "react";

// to store the state to local storage
export default function usePersistedState(key: string, defaultValue: any) {
  const [state, setState] = useState(() => {
    return JSON.parse(localStorage.getItem(key) ?? '{}') || defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
