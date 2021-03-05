import { PageInfo } from './types';
import { Storage, LocalStorage } from './storage';
import { TabGroup, Tab } from './models';
import { STORAGE_NAME } from './constants';

import { 
  insertTabBar, 
  Message, 
  MessageType, 
  openInAllTabs 
} from './utils';

const storage = Storage.init(LocalStorage, STORAGE_NAME);

storage.tabGroups.detachAllBrowserTabs();

// Trigger when the extension is intalled
chrome.runtime.onInstalled.addListener(() => {

  // Add an option to the context menu of the browser
  chrome.contextMenus.create({
    title: 'Agregar a la barra de pestañas ',
    contexts: ['link', 'page']
  });
});

// Receive messages from the UIs of the extension
chrome.runtime.onMessage.addListener((message: Message, sender, response) => {

  ((cb: () => void) => cb())(async () => {

    switch (message.type) {

      case MessageType.GET_TAB: {
        response(sender.tab);
        break;
      }
  
      case MessageType.NAVIGATE: {
        chrome.tabs.update({ url: message.arg.url });
        break;
      }
  
      case MessageType.OPEN_IN_NEW_TAB: {
  
        const pageGroup = message.arg.pageGroup as TabGroup;
        const selectedTab = pageGroup.tabs.find(tab => tab.isSelected) || pageGroup.tabs[0];
        const createProperties = { url: selectedTab.url };
  
        chrome.tabs.create(createProperties, async browserTab => {
          await storage.tabGroups.attachBrowserTab(pageGroup.id, browserTab.id);
          insertTabBar(browserTab.id);
        });
        
        break;
      }
  
      case MessageType.OPEN_IN_ALL_TABS: {
        const tabGroupId = message.arg.tabGroupId as string;
        await openInAllTabs(tabGroupId);
        break;
      }
  
      case MessageType.TAB_DELETED: {
        const tabGroup = message.arg.tabGroup as TabGroup;
        sendMessage(tabGroup.browserTabsId, MessageType.UPDATE_TAB_BAR);
        break;
      }
  
      case MessageType.CLOSE_TAB_BAR: {
        const tabGroup = message.arg.tabGroup as TabGroup;
        sendMessage(tabGroup.browserTabsId, MessageType.CLOSE_TAB_BAR);
        break;
      }
    } 

    response();
  });

  return true;
});

// Insert the tab bar in the page when the page is loading
chrome.webNavigation.onCommitted.addListener(async details => {

  if (details.frameId !== 0 || details.url === undefined) return;

  const tabGroup = await storage.tabGroups.getByBrowserTabId(details.tabId);

  if (tabGroup) {

    const { origin, pathname, hash } = new URL(details.url);
    const urlRegex = new RegExp(`${origin + pathname}(\\?[^#]*)?(${hash})?`);

    const selectedTab = tabGroup.tabs.find(tab => tab.isSelected);
    const tab = tabGroup.tabs.find(tab => urlRegex.test(tab.url));

    await storage.tabs.selectTab(selectedTab, false);
    await storage.tabs.selectTab(tab, true);

    insertTabBar(details.tabId);
  }
});

// Detach the tab bar from the browser tab when it is closed
chrome.tabs.onRemoved.addListener(async tabId => {
  const isAttach = await storage.tabGroups.isBrowserTabAttached(tabId);
  if (isAttach) {
    await storage.tabGroups.detachBrowserTab(tabId);
  }
});

// Listen when the context menu option is clicked
chrome.contextMenus.onClicked.addListener(async (info, browserTab) => {

  const tabGroup = await storage.tabGroups.getByBrowserTabId(browserTab.id);
  const url = info.linkUrl ? info.linkUrl : info.pageUrl;
  const enableMetaRedirect = Boolean(info.linkUrl);
  const pageInfo = await getPageInfo(url, enableMetaRedirect);

  if (tabGroup) {
    
    const tab = new Tab(undefined, pageInfo.title, pageInfo.url, tabGroup.id, false, pageInfo.favicon);
    await storage.tabs.addTab(tab);
    sendMessage(tabGroup.browserTabsId, MessageType.UPDATE_TAB_BAR);

  } else {

    const tabGroup = new TabGroup(undefined, [browserTab.id], 'Temporal', undefined, true);
    const tab = new Tab(undefined, pageInfo.title, pageInfo.url, tabGroup.id, false, pageInfo.favicon);
    
    await storage.tabGroups.addTabGroup(tabGroup);
    await storage.tabs.addTab(tab);

    insertTabBar(browserTab.id);
  }
});

function sendMessage(browserTabsId: number[], type: MessageType) {
  for (const browserTabId of browserTabsId) {
    chrome.tabs.sendMessage(browserTabId, { type });
  }
}

function getPageInfo(url: string, enableMetaRedirect: boolean): Promise<PageInfo> {

  return new Promise<PageInfo>(resolve => {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = async () => {

      if (XMLHttpRequest.DONE === xhr.readyState) {

        if (xhr.status === 200) {

          const document = xhr.responseXML;
          const metaRedirect = document.querySelector<HTMLMetaElement>('meta[http-equiv="Refresh"]');

          // if is a meta redirect, request the page info again with the redirect URL
          if (enableMetaRedirect && metaRedirect) {
            const [, url] = /url=(.*)/.exec(metaRedirect.content);
            resolve(await getPageInfo(url, true));
          }

          const title = document.title;
          const url = document.URL;
          const favicon = await getFavIconUrl(document);

          resolve({ title, url, favicon });
        }
      }
    };

    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.send();
  });
}

async function getFavIconUrl(document: Document) {

  const urlParser = new URL(document.URL);
  const url = urlParser.origin + '/favicon.ico';

  const favIconRequest = await fetch(url);
  const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');

  let favIconUrl: string;

  if (link) {

    // If the link element of the favicon exist in the html, use the url of the link element
    favIconUrl = link.href;

  } else if (favIconRequest.status === 200) {

    // If the favicon exist in the root of the project, use the url of the favicon
    favIconUrl = url;

  } else {

    // If the favicon wasn't found use a default favicon
    favIconUrl = chrome.runtime.getURL('images/default-favicon.svg');
  }

  return favIconUrl;
}
