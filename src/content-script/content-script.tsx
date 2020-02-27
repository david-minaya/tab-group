import './content-script.css';
import TitlePrefixer from './TitlePrefixer';
import insertTabBar from './insertTabBar';
import getBrowserTabId from '../utils/getBrowserTabId';
import { MessageType } from '../enums/message-type';
import { Storage, LocalStorage } from '../storage';

insertTabBar();

window.onload = async () => {

  const storage = new Storage(new LocalStorage());
  const tabId = await getBrowserTabId();
  const tabGroup = await storage.getTabGroupByTabId(tabId);
  const titleElement = document.querySelector('title');
  
  const titleUpdateListener = (title: string) => {
    chrome.runtime.sendMessage({ 
      type: MessageType.UPDATE_TAB, 
      arg: { tabId, title, isTitleUpdate: true } 
    });
  };

  const titlePrefixer = new TitlePrefixer(tabGroup.name, titleUpdateListener);
  titlePrefixer.prefixTitle();

  const observer = new MutationObserver(() => titlePrefixer.prefixTitle()); // eslint-disable-line no-undef
  const filter = { characterData: true, childList: true };
  observer.observe(titleElement, filter);
};
