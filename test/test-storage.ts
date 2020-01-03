import { TabGroup, StorageInterface } from '../src/storage';

export default class TestStorage implements StorageInterface {

  tabsGroup: TabGroup[];

  constructor() {
    this.tabsGroup = [];
  }

  getTabsGroup(key: string): Promise<TabGroup[]> {
    return new Promise((resolve, reject) => {
      resolve(this.tabsGroup);
    });
  }  
  
  setTabsGroup(tabsGroup: TabGroup[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tabsGroup = tabsGroup;
      resolve();
    });
  }

  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tabsGroup = [];
      resolve();
    });
  }
}
