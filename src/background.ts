import { MessageType } from './enums/message-type';
import Storage from './storage/storage';

interface Message {
  type: number,
  arg: any
}

chrome.runtime.onMessage.addListener((message: Message, sender, response) => {
  switch (message.type) {
    case MessageType.CREATE_TAB:
      response(sender.tab.id);
      break;
    case MessageType.NAVIGATE:
      chrome.tabs.update({ url: message.arg.tab.url });
      break;
  }
});

chrome.webNavigation.onCommitted.addListener(async details => {
  if (details.frameId !== 0) return;
  const storage = new Storage();
  const tabGroup = await storage.getTabGroupByTabId(details.tabId);
  if (tabGroup) {
    chrome.tabs.executeScript(tabGroup.tabId, { file: 'content-script.js'});
  }
});
