const VALID_METHODS = [
  "set",
  "add",
  "delete",
  "remove",
  "update",
  "clear",
  "load",
  "create",
  "rename",
  "reset",
  "init",
  "open",
  "close",
  "toggle",
  "hide",
  "append",
  "start",
  "stop",
  "pause",
  "resume",
  "select",
  "deselect",
  "increment",
  "decrement",
  "enable",
  "disable",
];

export function autoBind(instance: any): void {
  const namesSeen = new Set<string>();
  const protos: unknown[] = [];

  for (
    let proto = Object.getPrototypeOf(instance);
    proto && proto !== Object.prototype;
    proto = Object.getPrototypeOf(proto)
  ) {
    const names = Object.getOwnPropertyNames(proto);
    if (names.includes("setStoreName")) continue;
    protos.push(proto);
  }

  protos.forEach((proto: any) => {
    Object.getOwnPropertyNames(proto).forEach((key) => {
      if (key === "constructor") return;
      if (namesSeen.has(key)) return;
      namesSeen.add(key);

      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (!desc || typeof desc.value !== "function") return;

      instance[key] = function (...args: unknown[]) {
        const isValid = VALID_METHODS.some((prefix) => key.startsWith(prefix));
        if (!isValid) return desc.value.apply(instance, args);
        const result = desc.value.apply(instance, args);
        instance.notify();
        return result;
      };
    });
  });
}
