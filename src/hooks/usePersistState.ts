import { useEffect, useState } from "react";

export function usePersistState<T>(init: T) {
  const [state, setState] = useState<T>(init);

  useEffect(() => {
    window.localStorage.setItem("storage", JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
