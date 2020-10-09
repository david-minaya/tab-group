import { IStorage } from './istorage';
import { TabsGroups } from './tabs-groups';
import { Tabs } from './tabs';

export class Storage {
  
  private static instance: Storage;
  private storage: IStorage;
  public tabsGroups: TabsGroups;
  public tabs: Tabs;

  static init<T extends IStorage>(Class: new () => T, name: string) {
    if (!Storage.instance) {
      Storage.instance = new Storage(new Class(), name);
    }
    return Storage.instance;
  }

  private constructor(storage: IStorage, name: string) {
    this.storage = storage;
    this.tabsGroups = new TabsGroups(storage, name);
    this.tabs = new Tabs(this.tabsGroups);
  }

  async clear() {
    await this.storage.clear();
  }
}
