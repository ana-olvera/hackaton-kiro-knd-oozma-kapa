import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'michi-godin-db';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('gameProgress')) {
          db.createObjectStore('gameProgress', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async save(store: string, data: unknown): Promise<void> {
    if (!this.db) await this.initialize();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readwrite');
      const objectStore = tx.objectStore(store);
      const request = objectStore.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load<T>(store: string, key: string): Promise<T | null> {
    if (!this.db) await this.initialize();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly');
      const objectStore = tx.objectStore(store);
      const request = objectStore.get(key);
      request.onsuccess = () => resolve(request.result as T ?? null);
      request.onerror = () => reject(request.error);
    });
  }
}
