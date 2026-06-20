class DBService {
  constructor() {
    this.indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    this.idbTransaction =
      window.IDBTransaction ||
      window.webkitIDBTransaction ||
      window.msIDBTransaction;
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open("TravelEditorDB");

      request.onerror = (err) => reject(err);

      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        request.result.createObjectStore("Countries");
        request.result.createObjectStore("Markers", {
          keyPath: "id",
          autoIncrement: true,
        });
      };
    });
  }

  // accessMode: readonly, readwrite
  async getStore(storeName, accessMode) {
    if (!this.connection) {
      this.connection = await this.getConnection();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.connection.transaction(storeName, accessMode);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      resolve(transaction.objectStore(storeName));
    });
  }

  // IE doen't support getAll(). make polyfill
  async getAllFromStore(storeName) {
    if (!this.connection) {
      this.connection = await this.getConnection();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.connection.transaction(storeName, "readonly");
      const objectStore = transaction.objectStore(storeName);

      if ("getAll" in objectStore) {
        const request = objectStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve([]);
        transaction.onerror = () => reject(transaction.error);
      } else {
        const values = [],
          request = objectStore.openCursor();

        request.onsuccess = function (event) {
          const cursor = event.target.result;

          if (cursor) {
            values.push(cursor.value);
            cursor.continue();
          } else {
            resolve(values);
          }
        };
      }
    });
  }
}

export const dbService = new DBService();
