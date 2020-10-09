import { IStorage } from './istorage';
import { TabGroup } from '../models/tab-group';

export class LocalStorage implements IStorage {

  storage: chrome.storage.LocalStorageArea;

  constructor() {
    this.storage = chrome.storage.local;
  }

  get(key: string): Promise<[]> {
    return new Promise((resolve, reject) => {
      this.storage.get(key, result => {
        const data = result[key] || [];
        resolve(data);
      });
    });
  }  
  
  set(key: string, data: []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set({ [key]: data }, () => {
        resolve();
      });
    });
  }

  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.clear(() => resolve());
    });
  }
}
