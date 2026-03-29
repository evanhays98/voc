import { createStore } from "@starter/global-store";
import { CustomLessonsStore } from "./CustomLessonsStore";

const store = new CustomLessonsStore();

export const customLessonsStore = createStore("CustomLessonsStore", store);

export const useCustomLessons = () => customLessonsStore.useReactiveStore();
export const useCustomLessonsFn = () => customLessonsStore.useStoreFn();
