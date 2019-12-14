import { StorageInterface } from './storage-interface';
import TabGroup from './tab-group';

export default class LocalStorage implements StorageInterface {

  storage: chrome.storage.LocalStorageArea;

  constructor() {
    this.storage = chrome.storage.local;
  }

  getTabsGroup(key: string): Promise<TabGroup[]> {
    return new Promise((resolve, reject) => {
      this.storage.get(key, result => {
        const tabsGroup = result.tabsGroup || [];
        resolve(tabsGroup);
      });
    });
  }  
  
  setTabsGroup(tabsGroup: TabGroup[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set({ tabsGroup }, () => {
        resolve();
      });
    });
  }
}
