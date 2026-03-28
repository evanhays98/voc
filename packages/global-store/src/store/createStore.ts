import { storeManager } from "./StoreManager";
import { helperStore, HelperStoreReturn } from "./useHelperStore";

export function createStore<T extends object>(
  name: string,
  initialData: T,
): HelperStoreReturn<T> {
  storeManager.initializeStore(name, initialData);
  return helperStore(name);
}
