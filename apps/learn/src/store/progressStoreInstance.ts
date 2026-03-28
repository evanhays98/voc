import { createStore } from "@starter/global-store";
import { ProgressStore } from "./ProgressStore";

const store = new ProgressStore();

export const progressStore = createStore("ProgressStore", store);

export const useProgress = () => progressStore.useReactiveStore();
export const useProgressFn = () => progressStore.useStoreFn();
