/* eslint-disable no-undef */
import TabGroup from './tab-group';

export default class Storage {

  storage: chrome.storage.LocalStorageArea;

  constructor() {
    this.storage = chrome.storage.local;
  }

  getTabsGroups() {
    return this._getTabsGroups();
  }

  async getTabGroup(id: Number) {
    const tabsGroups = await this._getTabsGroups();
    const tabGroup = tabsGroups.find((tabGroup) => tabGroup.id === id);
    return tabGroup;
  };

  _getTabsGroups(): Promise<TabGroup[]> {
    return new Promise((resolve, reject) => {
      this.storage.get('tabsGroups', result => {
        resolve(result.tabsGroups);
      });
    });
  }
}
