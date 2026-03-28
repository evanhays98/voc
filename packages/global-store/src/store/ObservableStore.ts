import { v4 as uuidv4 } from "uuid";
import { storeManager } from "./StoreManager";
import { autoBind } from "./autoBind";

export abstract class ObservableStore {
  storeName: string;

  constructor(storeName?: string) {
    autoBind(this);
    const id = storeName || uuidv4();
    this.storeName = id;
  }

  setStoreName(name: string) {
    this.storeName = name;
    autoBind(this);
  }

  protected notify(): void {
    storeManager.updateStore(this.storeName);
  }
}
