import { forEach, isArray, isMap, isSet } from "lodash";

type Primitive = string | number | boolean | null | undefined;

type AbstractCtor<T> = abstract new (...args: any[]) => T;

function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function callInstanceClass<T>(
  obj: unknown,
  targetClass: AbstractCtor<T>,
  onInstance: (instance: T) => void,
): void {
  if (obj instanceof targetClass) onInstance(obj);

  if (isArray(obj)) {
    forEach(obj as unknown[], (val: unknown) => {
      callInstanceClass(val, targetClass, onInstance);
    });
    return;
  }
  if (isMap(obj)) {
    (obj as Map<unknown, unknown>).forEach((val) => {
      callInstanceClass(val, targetClass, onInstance);
    });
    return;
  }
  if (isSet(obj)) {
    (obj as Set<unknown>).forEach((val) => {
      callInstanceClass(val, targetClass, onInstance);
    });
    return;
  }

  if (typeof obj === "object") {
    forEach(obj as Record<string, unknown>, (val: unknown) => {
      callInstanceClass(val, targetClass, onInstance);
    });
    return;
  }

  if (typeof obj === "function") return;

  if (!isPrimitive(obj)) {
    throw new TypeError(
      `Expected a primitive, plain object, array, map or set, but got ${typeof obj} instead.`,
    );
  }
}
