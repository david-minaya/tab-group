import * as uuid from 'uuid/v4';
import { TabGroup } from './tab-group';
import { Tab } from './tab';
import { StorageInterface } from './storage-interface';

export class Storage {
  
  storage: StorageInterface;

  constructor(storage: StorageInterface) {
    this.storage = storage;
  }

  async addTabGroup(tabGroup: TabGroup) {
    this.addTabGroupId(tabGroup);
    this.settingDefaultTab(tabGroup.tabs[0]);
    const tabsGroup = await this.getTabsGroup();
    tabsGroup.push(tabGroup);
    await this.storage.setTabsGroup(tabsGroup);
  }

  async addTab(tab: Tab) {
    this.settingDefaultTab(tab);
    const tabGroup = await this.getTabGroup(tab.tabGroupId);
    tabGroup.tabs.push(tab);
    await this.updateTabGroup(tabGroup);

  }

  async getTabsGroup(): Promise<TabGroup[]> {
    return this.storage.getTabsGroup('tabsGroup');
  }

  async getTabGroup(id: string) {
    const tabsGroups = await this.getTabsGroup();
    const tabGroup = tabsGroups.find(tabGroup => tabGroup.id === id);
    return tabGroup;
  };

  async getTabGroupByTabId(tabId: number) {
    const tabsGroup = await this.getTabsGroup();
    const tabGroup = tabsGroup.find(tabGroup => tabGroup.tabId === tabId);
    return tabGroup;
  }

  async isBrowserTabAttached(browserTabId: number) {
    const tabsGroups = await this.getTabsGroup();
    const isAssigned = tabsGroups.some(tabGroup => tabGroup.tabId === browserTabId);
    return isAssigned;
  }

  async selectTab(tab: Tab, select: boolean) {
    const tabsGroup = await this.getTabsGroup();
    const tabGroup = tabsGroup.find(tabGroup => tabGroup.id === tab.tabGroupId);
    const tabFound = tabGroup.tabs.find(currentTab => currentTab.id === tab.id);
    tabFound.isSelected = select;
    await this.updateTabGroup(tabGroup);
  }

  async attachBrowserTab(tabId: string, browserTabId: number) {
    const tabGroup = await this.getTabGroup(tabId);
    tabGroup.tabId = browserTabId;
    await this.updateTabGroup(tabGroup);
  }

  async detachBrowserTab(browserTabId: number) {
    const tabGroup = await this.getTabGroupByTabId(browserTabId);
    tabGroup.tabId = undefined;
    await this.updateTabGroup(tabGroup);
  }

  async clear() {
    await this.storage.clear();
  }

  private addTabGroupId(tabGroup: TabGroup) {
    if (!tabGroup.id) {
      tabGroup.id = uuid();
    }
    tabGroup.tabs[0].tabGroupId = tabGroup.id;
  }

  private settingDefaultTab(tab: Tab) {
    if (tab) {
      tab.id = !tab.id ? uuid() : tab.id;
      tab.isSelected = true;
    }
  }

  private async updateTabGroup(updatedTabGroup: TabGroup) {
    const tabsGroup = await this.getTabsGroup();
    const index = tabsGroup.findIndex(tabGroup => tabGroup.id === updatedTabGroup.id);
    tabsGroup[index] = updatedTabGroup;
    await this.storage.setTabsGroup(tabsGroup);
  }
}
