import { createStore } from "@starter/global-store";
import { SettingsStore } from "./SettingsStore";

const store = new SettingsStore();

export const settingsStore = createStore("SettingsStore", store);

export const useSettings = () => settingsStore.useReactiveStore();
export const useSettingsFn = () => settingsStore.useStoreFn();
