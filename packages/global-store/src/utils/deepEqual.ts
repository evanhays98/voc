export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a === "function" && typeof b === "function") {
    return a.toString() === b.toString();
  }

  if (
    a == null ||
    b == null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return a === b;
  }

  if (a instanceof Set && b instanceof Set) {
    const transformA = Array.from(a).map((item) =>
      typeof item === "object" ? JSON.stringify(item) : item,
    );
    const transformB = Array.from(b).map((item) =>
      typeof item === "object" ? JSON.stringify(item) : item,
    );
    if (transformA.length !== transformB.length) return false;
    return transformA.every((item) => transformB.includes(item));
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a.entries()) {
      if (!b.has(key) || !deepEqual(value, b.get(key))) {
        return false;
      }
    }
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
    if (!deepEqual(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}
