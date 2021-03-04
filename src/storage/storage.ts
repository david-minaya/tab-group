import { IStorage } from './istorage';
import { TabGroups } from './tab-groups';
import { Tabs } from './tabs';

export class Storage {
  
  private static instance: Storage;
  private storage: IStorage;
  public tabGroups: TabGroups;
  public tabs: Tabs;

  static init<T extends IStorage>(Class: new () => T, name: string) {
    if (!Storage.instance) {
      Storage.instance = new Storage(new Class(), name);
    }
    return Storage.instance;
  }

  private constructor(storage: IStorage, name: string) {
    this.storage = storage;
    this.tabGroups = new TabGroups(storage, name);
    this.tabs = new Tabs(this.tabGroups);
  }

  async clear() {
    await this.storage.clear();
  }
}
