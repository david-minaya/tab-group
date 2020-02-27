import { MessageType } from '../enums/message-type';

export default function getTabId(): Promise<number> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: MessageType.GET_TAB_ID }, tabId => {
      resolve(tabId);
    });
  });
}
