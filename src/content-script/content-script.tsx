import './content-script.css';
import TitlePrefixer from './TitlePrefixer';
import getFaviconUrl from './getFaviconUrl';
import insertTabBar from './insertTabBar';
import getBrowserTabId from '../utils/getBrowserTabId';
import { MessageType } from '../enums/message-type';
import { Storage, LocalStorage } from '../storage';

insertTabBar();

window.onload = async () => {

  const url = window.location.href;
  const storage = new Storage(new LocalStorage());
  const tabId = await getBrowserTabId();
  const tabGroup = await storage.getTabGroupByTabId(tabId);
  const favIconUrl = getFaviconUrl();
  const titleElement = document.querySelector('title');
  
  const titleUpdateListener = (title: string) => {
    chrome.runtime.sendMessage({ 
      type: MessageType.UPDATE_TAB, 
      arg: { title, url, tabId, favIconUrl } 
    });
  };

  const titlePrefixer = new TitlePrefixer(tabGroup.name, titleUpdateListener);
  titlePrefixer.prefixTitle();

  const observer = new MutationObserver(() => titlePrefixer.prefixTitle()); // eslint-disable-line no-undef
  const filter = { characterData: true, childList: true };
  observer.observe(titleElement, filter);
};
