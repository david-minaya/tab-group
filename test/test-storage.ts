import { IStorage } from '../src/storage';

export default class TestStorage implements IStorage {

  tabsGroup: any[];

  constructor() {
    this.tabsGroup = [];
  }

  get<T>(key: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      resolve(this.tabsGroup);
    });
  }  
  
  set<T>(key: string, data: T[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tabsGroup = data;
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
