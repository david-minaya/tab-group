/* eslint-disable no-undef */
import TabGroup from './tab-group';
import * as uuid from 'uuid/v4';
import Tab from './tab';

export default class Storage {

  storage: chrome.storage.LocalStorageArea;

  constructor() {
    this.storage = chrome.storage.local;
  }

  async addTabGroup(tabGroup: TabGroup) {
    this.addTabGroupId(tabGroup);
    this.addTabId(tabGroup.tabs[0]);
    const tabsGroup = await this.getTabsGroup();
    tabsGroup.push(tabGroup);
    await this.setTabsGroup(tabsGroup);
  }

  private addTabGroupId(tabGroup: TabGroup) {
    if (!tabGroup.id) {
      tabGroup.id = uuid();
    }
    tabGroup.tabs[0].tabGroupId = tabGroup.id;
  }

  private addTabId(tab: Tab) {
    if (!tab.id) {
      tab.id = uuid();
    }
  }

  getTabsGroup(): Promise<TabGroup[]> {
    return new Promise((resolve, reject) => {
      this.storage.get('tabsGroup', result => {
        const tabsGroup = result.tabsGroup || [];
        resolve(tabsGroup);
      });
    });
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

  async isBrowserTabAssigned(browserTabId: number) {
    const tabsGroups = await this.getTabsGroup();
    const isAssigned = tabsGroups.some(tabGroup => tabGroup.tabId === browserTabId);
    return isAssigned;
  }

  async selectTab(tab: Tab) {
    const tabsGroup = await this.getTabsGroup();
    const tabGroupFound = tabsGroup.find(tabGroup => tabGroup.id === tab.tabGroupId);
    const tabFound = tabGroupFound.tabs.find(currentTab => currentTab.id === tab.id);
    tabFound.isSelected = true;
    await this.setTabsGroup(tabsGroup);
  }

  private async setTabsGroup(tabsGroup: TabGroup[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set({ tabsGroup }, () => {
        resolve();
      });
    });
  }
}
