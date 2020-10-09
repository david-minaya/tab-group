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
  };

  async getTabGroupByTabId(tabId: number) {
    const tabsGroup = await this.getTabsGroup();
    const tabGroup = tabsGroup.find(tabGroup => tabGroup.tabId === tabId);
    return tabGroup;
  }

  async updateTabGroup(updatedTabGroup: TabGroup) {
    const tabsGroups = await this.getTabsGroup();
    const index = tabsGroups.findIndex(tabGroup => tabGroup.id === updatedTabGroup.id);
    tabsGroups[index] = updatedTabGroup;
    await this.setTabsGroups(tabsGroups);
  }

  async deleteTabGroup(tabGroupId: string) {
    const tabsGroups = await this.getTabsGroup();
    const tabGroupIndex = tabsGroups.findIndex(tabGroup => tabGroup.id === tabGroupId);
    tabsGroups.splice(tabGroupIndex, 1);
    await this.setTabsGroups(tabsGroups);
  }
}
