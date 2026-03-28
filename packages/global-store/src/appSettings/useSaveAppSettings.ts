import { useEffect, useState } from "react";
import { useAppSettingsFn, useAppSettingsStore } from "./appSettingsStore";

export const useSaveAppSettings = () => {
  const appSettings = useAppSettingsStore();
  const { saveInDb: saveAppSettings, loadDb: loadAppSettings } =
    useAppSettingsFn();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await loadAppSettings();
      setIsLoaded(true);
    })();
  }, [loadAppSettings]);

  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      await saveAppSettings();
    })();
  }, [isLoaded, saveAppSettings, appSettings]);

  return isLoaded;
};
