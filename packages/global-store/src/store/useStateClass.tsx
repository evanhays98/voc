import { useEffect, useMemo, useState } from "react";
import { cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";
import { storeManager } from "./StoreManager";
import { ObservableStore } from "./ObservableStore";

export const useStateClass = <T extends ObservableStore>(
  source: T,
  onChange?: (data: T) => void,
): T => {
  const storeName = useMemo(() => {
    const id = uuid();
    const clone = cloneDeep(source);
    clone.setStoreName(id);
    storeManager.initializeStore(id, clone);
    return id;
  }, []);

  const [state, setState] = useState<T>(() => {
    const storeData = storeManager.getStore<T>(storeName);
    if (!storeData) throw new Error(`Store "${storeName}" is not initialized.`);
    return storeData;
  });

  useEffect(() => {
    const unsubscribe = storeManager.subscribe<T>(storeName, (newData) => {
      onChange?.(cloneDeep(newData));
      setState(newData);
    });

    return () => {
      unsubscribe();
      storeManager.removeStore(storeName);
    };
  }, [storeName]);

  return state;
};
