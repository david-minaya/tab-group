import { IStorage } from './istorage';
import { TabGroup } from '../models';

export class TabGroups {

  constructor(private storage: IStorage, private name: string) {}

  async addTabGroup(tabGroup: TabGroup) {
    const tabGroups = await this.getTabGroups();
    tabGroups.push(tabGroup);
    await this.setTabsGroups(tabGroups);
  }

  getTabGroups(): Promise<TabGroup[]> {
    return this.storage.get(this.name);
  }

  setTabsGroups(tabGroups: TabGroup[]): Promise<void> {
    return this.storage.set(this.name, tabGroups);
  }

  async getTabGroup(id: string) {
    const tabGroups = await this.getTabGroups();
    const tabGroup = tabGroups.find(tabGroup => tabGroup.id === id);
    return tabGroup;
  }

  async getByTabId(id: string) {
    const tabGroups = await this.getTabGroups();
    return tabGroups.find(tabGroup => 
      tabGroup.tabs.some(tab => tab.id === id)
    );
  }

  async getByBrowserTabId(browserTabId: number) {
    const tabGroups = await this.getTabGroups();
    const tabGroup = tabGroups.find(tabGroup => 
      tabGroup.browserTabsId.includes(browserTabId)
    );
    return tabGroup;
  }

  async isBrowserTabAttached(browserTabId: number) {
    const tabGroup = await this.getByBrowserTabId(browserTabId);
    return tabGroup != undefined;
  }

  async attachBrowserTab(id: string, browserTabId: number) {
    const tabGroup = await this.getTabGroup(id);
    if (!tabGroup.browserTabsId) {
      tabGroup.browserTabsId = [];
    }
    tabGroup.browserTabsId.push(browserTabId);
    await this.updateTabGroup(tabGroup);
  }

  async detachBrowserTab(browserTabId: number) {
    const tabGroup = await this.getByBrowserTabId(browserTabId);
    tabGroup.browserTabsId = [];
    await this.updateTabGroup(tabGroup);
  }

  async detachAllBrowserTabs() {
    const tabGroups = await this.getTabGroups();
    tabGroups.forEach(tabGroup => {
      if (tabGroup.browserTabsId.length !== 0) {
        tabGroup.browserTabsId = [];
      }
    });
    await this.setTabsGroups(tabGroups);
  }

  async updateTabGroup(updatedTabGroup: TabGroup) {
    const tabGroups = await this.getTabGroups();
    const index = tabGroups.findIndex(tabGroup => tabGroup.id === updatedTabGroup.id);
    tabGroups[index] = updatedTabGroup;
    await this.setTabsGroups(tabGroups);
  }

  async delete(id: string) {
    const tabGroups = await this.getTabGroups();
    const index = tabGroups.findIndex(tabGroup => tabGroup.id === id);
    tabGroups.splice(index, 1);
    await this.setTabsGroups(tabGroups);
  }
}
