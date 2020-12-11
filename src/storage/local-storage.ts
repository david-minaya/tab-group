import { IStorage } from './istorage';

export class LocalStorage implements IStorage {

  storage: chrome.storage.LocalStorageArea;

  constructor() {
    this.storage = chrome.storage.local;
  }

  get(key: string): Promise<[]> {
    return new Promise(resolve => {
      this.storage.get(key, result => {
        const data = result[key] || [];
        resolve(data);
      });
    });
  }  
  
  set(key: string, data: []): Promise<void> {
    return new Promise(resolve => {
      this.storage.set({ [key]: data }, () => {
        resolve();
      });
    });
  }

  clear(): Promise<void> {
    return new Promise(resolve => {
      this.storage.clear(() => resolve());
    });
  }
}
