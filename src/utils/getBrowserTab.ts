import { MessageType } from './message-type';

export function getBrowserTab(): Promise<chrome.tabs.Tab> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: MessageType.GET_TAB }, tab => {
      resolve(tab);
    });
  });
}
