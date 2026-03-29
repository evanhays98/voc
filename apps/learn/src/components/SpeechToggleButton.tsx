import { LuVolume2, LuVolumeX } from "react-icons/lu";
import { useSettings, useSettingsFn } from "../store/settingsStoreInstance";

export const SpeechToggleButton = () => {
  const settings = useSettings();
  const { setIsSpeechEnabled } = useSettingsFn();

  const Icon = settings.isSpeechEnabled ? LuVolume2 : LuVolumeX;
  const label = settings.isSpeechEnabled ? "Son activé" : "Son coupé";

  return (
    <button
      onClick={() => setIsSpeechEnabled(!settings.isSpeechEnabled)}
      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
        settings.isSpeechEnabled
          ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          : "border-gray-200 bg-white/80 text-gray-600 hover:border-gray-300 hover:text-gray-800"
      }`}
      type="button"
      aria-pressed={!settings.isSpeechEnabled}
      aria-label={label}
      title={label}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{settings.isSpeechEnabled ? "Son" : "Muet"}</span>
    </button>
  );
};