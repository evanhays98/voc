import { getFromDb, saveInDb } from "../utils/dbHelp";
import { ObservableStore } from "../store/ObservableStore";

export class AppSettings extends ObservableStore {
  appName = "Starter App";
  locale = "en";

  static fromJson(json: any) {
    const settings = new AppSettings();
    settings.appName = json.appName ?? "Starter App";
    settings.locale = json.locale ?? "en";
    return settings;
  }

  async loadDb(): Promise<AppSettings | null> {
    const data = await getFromDb<any>(this.storeName);
    if (!data) return null;
    const dbAppSettings = AppSettings.fromJson(data);
    this.appName = dbAppSettings.appName;
    this.locale = dbAppSettings.locale;
    this.notify();
    return this;
  }

  setAppName(appName: string) {
    this.appName = appName;
  }

  setLocale(locale: string) {
    this.locale = locale;
  }

  toJson() {
    return {
      appName: this.appName,
      locale: this.locale,
    };
  }

  async saveInDb() {
    await saveInDb({ tableName: this.storeName, data: this.toJson() });
  }
}
