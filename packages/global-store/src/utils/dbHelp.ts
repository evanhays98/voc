import { cloneDeep } from "lodash";
import { openDB } from "idb";

interface SaveProps<T extends object> {
  data: T;
  tableName: string;
}

export const saveInDb = async <T extends object>(props: SaveProps<T>) => {
  const { tableName, data } = props;
  console.log("Saving to DB:", tableName, data);
  const dbName = "aidit-app-" + tableName;
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { keyPath: "id" });
      }
    },
  });
  await db.put(tableName, { id: "data", value: cloneDeep(data) });
};

export const getFromDb = async <T extends object>(
  tableName: string,
): Promise<T | undefined> => {
  const dbName = "aidit-app-" + tableName;
  console.log("Getting from DB:", tableName);
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      console.log(db.objectStoreNames);
      if (!db.objectStoreNames.contains(tableName)) {
        console.log("Creating object store:", tableName);
        db.createObjectStore(tableName, { keyPath: "id" });
      }
    },
  });
  const data = await db.get(tableName, "data");
  if (!data) return undefined;
  return data.value;
};
