import { TabGroups } from './tab-groups';
import { Tab } from '../models';

export class Tabs {

  constructor(private tabGroups: TabGroups) {}

  async addTab(tab: Tab) {
    const tabGroup = await this.tabGroups.getTabGroup(tab.tabGroupId);
    tabGroup.tabs.push(tab);
    await this.tabGroups.updateTabGroup(tabGroup);
  }

  async updateTab(updatedTab: Tab) {
    const tabGroup = await this.tabGroups.getTabGroup(updatedTab.tabGroupId);
    const tabs = tabGroup.tabs;
    const index = tabs.findIndex(tab => tab.id === updatedTab.id);
    tabs[index] = updatedTab;
    await this.tabGroups.updateTabGroup(tabGroup);
  }

  async rename(id: string, title: string) {
    const tabGroup = await this.tabGroups.getByTabId(id);
    tabGroup.tabs.forEach(tab => { 
      if (tab.id === id) tab.title = title;
    });
    await this.tabGroups.updateTabGroup(tabGroup);
  }

  async selectTab(tab: Tab, select: boolean) {
    
    if (!tab) return;
    
    const tabGroups = await this.tabGroups.getTabGroups();
    const tabGroup = tabGroups.find(tabGroup => tabGroup.id === tab.tabGroupId);
    const tabFound = tabGroup.tabs.find(currentTab => currentTab.id === tab.id);
    
    tabFound.isSelected = select;
    
    await this.tabGroups.updateTabGroup(tabGroup);
  }

  async deleteTab(tab: Tab) {
    const tabGroup = await this.tabGroups.getTabGroup(tab.tabGroupId);
    const index = tabGroup.tabs.findIndex(currentTab => currentTab.id === tab.id);
    tabGroup.tabs.splice(index, 1);
    await this.tabGroups.updateTabGroup(tabGroup);
  }
}
