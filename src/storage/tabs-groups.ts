import { IStorage } from './istorage';
import { TabGroup } from '../models';

export class TabsGroups {

  constructor(private storage: IStorage, private name: string) {}

  async addTabGroup(tabGroup: TabGroup) {
    const tabsGroup = await this.getTabsGroup();
    tabsGroup.push(tabGroup);
    await this.setTabsGroups(tabsGroup);
  }

  getTabsGroup(): Promise<TabGroup[]> {
    return this.storage.get(this.name);
  }

  setTabsGroups(tabsGroups: TabGroup[]): Promise<void> {
    return this.storage.set(this.name, tabsGroups);
  }

  async getTabGroup(id: string) {
    const tabsGroups = await this.getTabsGroup();
    const tabGroup = tabsGroups.find(tabGroup => tabGroup.id === id);
    return tabGroup;
  }

  async getByBrowserTabId(browserTabId: number) {
    const tabGroups = await this.getTabsGroup();
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

  async updateTabGroup(updatedTabGroup: TabGroup) {
    const tabsGroups = await this.getTabsGroup();
    const index = tabsGroups.findIndex(tabGroup => tabGroup.id === updatedTabGroup.id);
    tabsGroups[index] = updatedTabGroup;
    await this.setTabsGroups(tabsGroups);
  }

  async delete(id: string) {
    const tabGroups = await this.getTabsGroup();
    const index = tabGroups.findIndex(tabGroup => tabGroup.id === id);
    tabGroups.splice(index, 1);
    await this.setTabsGroups(tabGroups);
  }
}
