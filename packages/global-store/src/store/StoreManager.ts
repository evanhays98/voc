import { cloneDeep } from "lodash";
import { deepEqual } from "../utils/deepEqual";
import { callInstanceClass } from "./callInstanceClass";
import { deepCloneStore } from "./deepCloneStore";
import { ObservableStore } from "./ObservableStore";

type Listener<T> = (data: T, prev?: T) => void;
type Pending = { timer: number };
type Selector<T, S> = (state: T) => S;

type SelectorSub<T, S> = {
  selector: Selector<T, S>;
  deps: unknown[];
  listeners: Listener<S>[];
};

const FLUSH_DELAY = 16;

class StoreManager {
  private static instance: StoreManager;
  private stores = new Map<string, any>();
  private prevStores = new Map<string, any>();
  private subscribers = new Map<string, Set<Listener<any>>>();
  private selectorSubscribers = new Map<string, Set<SelectorSub<any, any>>>();
  private pendings = new Map<string, Pending>();

  private constructor() {}

  public static getInstance(): StoreManager {
    return (StoreManager.instance ??= new StoreManager());
  }

  public initializeStore<T extends object>(name: string, initial: T): void {
    console.log("StoreManager: Initializing store", name, initial);
    callInstanceClass(initial, ObservableStore, (instance) => {
      if (instance.storeName !== name) {
        instance.setStoreName(name);
      }
    });
    this.stores.set(name, initial);
    this.notifySubscribers(name, initial);
  }

  public getStore<T>(name: string): T | undefined {
    return this.stores.get(name);
  }

  public setStore<T extends object>(name: string, data: T): void {
    this.queueNotify(name, data);
    this.stores.set(name, data);
  }

  public removeStore(name: string): void {
    this.subscribers.delete(name);
    this.stores.delete(name);

    const pending = this.pendings.get(name);
    if (!pending) return;

    clearTimeout(pending.timer);
    this.pendings.delete(name);
  }

  public subscribe<T>(name: string, fn: Listener<T>): () => void {
    const listeners =
      this.subscribers.get(name) ??
      this.subscribers.set(name, new Set()).get(name)!;

    listeners.add(fn as Listener<any>);

    const current = this.stores.get(name);
    if (current !== undefined) fn(current);

    return () => this.subscribers.get(name)?.delete(fn as Listener<any>);
  }

  public subscribeSelector<T, S>(
    name: string,
    selector: Selector<T, S>,
    deps: unknown[] = [],
    fn: Listener<S>,
  ): () => void {
    const listeners =
      this.selectorSubscribers.get(name) ??
      this.selectorSubscribers.set(name, new Set()).get(name)!;

    const selectorSub = [...listeners].find(
      (sub) =>
        sub.selector === selector ||
        (deepEqual(sub.selector, selector) && deepEqual(sub.deps, deps)),
    );

    if (selectorSub) selectorSub.listeners.push(fn);
    else listeners.add({ selector, deps: [...deps], listeners: [fn] });

    const current = this.stores.get(name);
    if (current !== undefined) fn(selector(current));

    return () => {
      const target = [...listeners].find(
        (sub) =>
          (sub.selector === selector || deepEqual(sub.selector, selector)) &&
          deepEqual(sub.deps, deps),
      );
      if (!target) return;

      target.listeners = target.listeners.filter((listener) => listener !== fn);
      if (target.listeners.length === 0) listeners.delete(target);
    };
  }

  public updateStore(name: string): void {
    const current = this.stores.get(name);
    this.queueNotify(name, current);
  }

  private queueNotify<T>(name: string, _current: T): void {
    const pending = this.pendings.get(name);
    if (pending) return;

    const timer = window.setTimeout(() => {
      const store = this.stores.get(name);

      this.pendings.delete(name);

      if (store?.storeName !== name) return;
      callInstanceClass(store, ObservableStore, (instance) => {
        if (instance.storeName !== name) instance.setStoreName(name);
      });
      const currenData = cloneDeep(store);
      this.notifySubscribers(name, currenData);
    }, FLUSH_DELAY);

    this.pendings.set(name, { timer });
  }

  private notifySubscribers<T>(name: string, data: T): void {
    const prev = deepCloneStore(this.prevStores.get(name));
    if (prev && deepEqual(prev, data)) return;
    this.prevStores.set(name, cloneDeep(data));

    this.subscribers.get(name)?.forEach((listener) => listener(data));
    this.selectorSubscribers.get(name)?.forEach((sub) => {
      const prevData = sub.selector(prev);
      const selectedData = sub.selector(data);
      if (deepEqual(prevData, selectedData)) return;
      sub.listeners.forEach((listener) => listener(selectedData));
    });
  }
}

export const storeManager = StoreManager.getInstance();
(window as any).storeManager = storeManager;
