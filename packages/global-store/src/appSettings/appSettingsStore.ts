import { createStore } from "../store";
import { storesName } from "../AppStoreConst";
import { AppSettings } from "./appSettings";

export const appSettingsStore = createStore(
  storesName.AppSettings,
  new AppSettings(),
);

export const useAppSettingsStore = () => appSettingsStore.useReactiveStore();
export const useAppSettingsFn = () => appSettingsStore.useStoreFn();
export const useAppSettings = (keys: (keyof AppSettings)[]) =>
  appSettingsStore.useStore(keys);
