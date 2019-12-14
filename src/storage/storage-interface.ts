import TabGroup from './tab-group';

export interface StorageInterface {
  getTabsGroup(key: string): Promise<TabGroup[]>;
  setTabsGroup(tabsGroup: TabGroup[]): Promise<void>;
}
