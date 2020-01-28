import { MessageType } from './enums/message-type';
import { Message } from './message';
import { Storage, LocalStorage, TabGroup, Tab } from './storage';

const storage = new Storage(new LocalStorage());

// Receive messages from the UIs of the extension
chrome.runtime.onMessage.addListener((message: Message, sender, response) => {
  switch (message.type) {
    case MessageType.GET_TAB_ID:
      response(sender.tab.id);
      break;
    case MessageType.NAVIGATE:
      chrome.tabs.update({ url: message.arg.tab.url });
      break;
  }
});

// Insert the tab bar in the page when the page is loading
chrome.webNavigation.onCommitted.addListener(async details => {
  if (details.frameId !== 0) return;
  const tabGroup = await storage.getTabGroupByTabId(details.tabId);
  if (tabGroup) {
    chrome.tabs.executeScript(tabGroup.tabId, { file: 'content-script.js' });
  }
});

// Update the title and url of the selected tab when the browser tab is complete loaded
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, { title, url }) => {
  if (changeInfo.status === 'complete') {
    const tabGroup = await storage.getTabGroupByTabId(tabId);
    if (tabGroup) {
      chrome.tabs.sendMessage(tabId, { type: MessageType.UPDATE_TAB, arg: { title, url, tabId } });
    }
  }
});

// Detach the tab bar from the browser tab when it is closed
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const isAttach = await storage.isBrowserTabAttached(tabId);
  if (isAttach) {
    await storage.detachBrowserTab(tabId);
  }
});
