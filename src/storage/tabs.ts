import { TabsGroups } from './tabs-groups';
import { Tab } from '../models';

export class Tabs {

  constructor(private tabsGroups: TabsGroups) {}

  async addTab(tab: Tab) {
    const tabGroup = await this.tabsGroups.getTabGroup(tab.tabGroupId);
    tabGroup.tabs.push(tab);
    await this.tabsGroups.updateTabGroup(tabGroup);
  }

  async isBrowserTabAttached(browserTabId: number) {
    const tabsGroups = await this.tabsGroups.getTabsGroup();
    const isAssigned = tabsGroups.some(tabGroup => tabGroup.tabId === browserTabId);
    return isAssigned;
  }

  async updateTab(updatedTab: Tab) {
    const tabGroup = await this.tabsGroups.getTabGroup(updatedTab.tabGroupId);
    const tabs = tabGroup.tabs;
    const index = tabs.findIndex(tab => tab.id === updatedTab.id);
    tabs[index] = updatedTab;
    await this.tabsGroups.updateTabGroup(tabGroup);
  }

  async selectTab(tab: Tab, select: boolean) {
    
    if (!tab) return;
    
    const tabsGroup = await this.tabsGroups.getTabsGroup();
    const tabGroup = tabsGroup.find(tabGroup => tabGroup.id === tab.tabGroupId);
    const tabFound = tabGroup.tabs.find(currentTab => currentTab.id === tab.id);
    
    tabFound.isSelected = select;
    
    await this.tabsGroups.updateTabGroup(tabGroup);
  }

  async attachBrowserTab(tabId: string, browserTabId: number) {
    const tabGroup = await this.tabsGroups.getTabGroup(tabId);
    tabGroup.tabId = browserTabId;
    await this.tabsGroups.updateTabGroup(tabGroup);
  }

  async detachBrowserTab(browserTabId: number) {

    const tabGroup = await this.tabsGroups.getTabGroupByTabId(browserTabId);
    
    // If the tab group is temp delete it
    if (tabGroup.isTemp) {

      await this.tabsGroups.deleteTabGroup(tabGroup.id);

    } else {

      tabGroup.tabId = undefined;
      await this.tabsGroups.updateTabGroup(tabGroup);
    }
  }

  async deleteTab(tab: Tab) {
    const tabGroup = await this.tabsGroups.getTabGroup(tab.tabGroupId);
    const index = tabGroup.tabs.findIndex(currentTab => currentTab.id === tab.id);
    tabGroup.tabs.splice(index, 1);
    await this.tabsGroups.updateTabGroup(tabGroup);
  }
}
