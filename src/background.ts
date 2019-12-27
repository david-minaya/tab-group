import { MessageType } from './enums/message-type';
import LocalStorage from './storage/local-storage';
import Storage from './storage/storage';

interface Message {
  type: number,
  arg: any
}

const storage = new Storage(new LocalStorage());

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

chrome.webNavigation.onCommitted.addListener(async details => {
  if (details.frameId !== 0) return;
  const tabGroup = await storage.getTabGroupByTabId(details.tabId);
  if (tabGroup) {
    chrome.tabs.executeScript(tabGroup.tabId, { file: 'content-script.js'});
  }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const isAttach = await storage.isBrowserTabAttached(tabId);
  if (isAttach) {
    await storage.detachBrowserTab(tabId);
  }
});
