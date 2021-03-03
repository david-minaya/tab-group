import { insertTabBar } from '.';
import { Storage, LocalStorage } from '../storage';
import { STORAGE_NAME } from '../constants';

const storage = Storage.init(LocalStorage, STORAGE_NAME);

export async function openInAllTabs(tabGroupId: string): Promise<void> {
  return new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true }, async tabs => {
      for (const tab of tabs) {
        const isAttached = await storage.tabsGroups.isBrowserTabAttached(tab.id);
        const isScriptable = tab.url != undefined;
        if (!isAttached && isScriptable) {
          await storage.tabsGroups.attachBrowserTab(tabGroupId, tab.id);
          insertTabBar(tab.id);
        }
      }
      resolve();
    });
  });
}
