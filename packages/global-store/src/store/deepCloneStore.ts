import { cloneDeepWith } from "lodash";
import { autoBind } from "./autoBind";
import { ObservableStore } from "./ObservableStore";

export const deepCloneStore = <T>(value: T): T => {
  const seen = new WeakMap<object, unknown>();

  const customizer = (val: any): any => {
    if (val instanceof ObservableStore) {
      if (seen.has(val)) return seen.get(val);

      const clone = Object.create(Object.getPrototypeOf(val));

      for (const key of Object.keys(val)) {
        const prop = (val as any)[key];
        clone[key] = cloneDeepWith(prop, customizer);
      }

      autoBind(clone);

      seen.set(val, clone);
      return clone;
    }

    if (typeof val === "function") return undefined;
    return undefined;
  };

  return cloneDeepWith(value, customizer) as T;
};
