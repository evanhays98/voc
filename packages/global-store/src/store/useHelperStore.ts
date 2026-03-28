import { useEffect, useMemo, useState } from "react";
import { storeManager } from "./StoreManager";

type MethodsOf<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

export type HelperStoreReturn<T> = {
  useReactiveStore: () => T;
  useStore: <K extends (keyof T)[]>(keys: K) => Pick<T, K[number]>;
  setStore: (data: T) => void;
  useStoreFn: () => MethodsOf<T>;
  getStore: () => T;
  useSelectorStore: <S>(selector: (state: T) => S, deps?: unknown[]) => S;
  removeStore: () => void;
};

export function helperStore<T extends object>(
  name: string,
): HelperStoreReturn<T> {
  const useSelectorStore = <S>(
    selector: (state: T) => S,
    deps: unknown[] = [],
  ) => {
    const [state, setState] = useState(() => {
      const storeData = storeManager.getStore<T>(name);
      if (!storeData) {
        throw new Error(`Store "${name}" is not initialized.`);
      }
      return selector(storeData);
    });

    useEffect(() => {
      const unsubscribe = storeManager.subscribeSelector<T, S>(
        name,
        selector,
        deps,
        (newData) => {
          setTimeout(() => {
            setState(newData);
          }, 0);
        },
      );

      return () => unsubscribe();
    }, deps);

    return state;
  };

  const useReactiveStore = () => {
    const [state, setState] = useState(() => {
      const storeData = storeManager.getStore<T>(name);
      if (!storeData) {
        throw new Error(`Store "${name}" is not initialized.`);
      }
      return storeData;
    });

    useEffect(() => {
      const unsubscribe = storeManager.subscribe<T>(name, (newData) => {
        setTimeout(() => {
          setState(newData);
        }, 0);
      });

      return () => unsubscribe();
    }, []);

    return state;
  };

  const useStore = <K extends (keyof T)[]>(keys: K): Pick<T, K[number]> => {
    return useSelectorStore(
      (storeData) => {
        const selectedObject: Partial<Pick<T, K[number]>> = {};
        keys.forEach((key) => {
          selectedObject[key] = storeData[key];
        });
        return selectedObject as Pick<T, K[number]>;
      },
      [keys.join(",")],
    );
  };

  const useStoreFn = (): MethodsOf<T> => {
    const methods = useMemo(() => {
      const store = storeManager.getStore<T>(name);
      if (!store) {
        throw new Error(`Store "${name}" is not initialized.`);
      }

      const proto = Object.getPrototypeOf(store);

      const methodNames = Object.getOwnPropertyNames(proto).filter(
        (key) =>
          key !== "constructor" && typeof (store as any)[key] === "function",
      );

      const boundMethods = Object.fromEntries(
        methodNames.map((key) => [key, (store as any)[key].bind(store)]),
      ) as MethodsOf<T>;

      return boundMethods;
    }, []);

    return methods;
  };

  const getStore = () => {
    const storeData = storeManager.getStore<T>(name);
    if (!storeData) {
      throw new Error(`Store "${name}" is not initialized.`);
    }
    return storeData;
  };

  return {
    useReactiveStore,
    useStore,
    useSelectorStore,
    setStore: (data: T) => storeManager.setStore(name, data),
    useStoreFn,
    getStore,
    removeStore: () => storeManager.removeStore(name),
  };
}
