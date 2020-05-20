import { Message, MessageType } from './utils';
import { Storage, LocalStorage, TabGroup, Tab } from './storage';
import defaultFavicon from './images/default-favicon.svg';

const storage = new Storage(new LocalStorage());

// Trigger when the extension is intalled
chrome.runtime.onInstalled.addListener(() => {

  // Add an option to the context menu of the browser
  chrome.contextMenus.create({
    title: 'Agregar a la barra de pestañas ',
    contexts: ['link']
  });
});

// Receive messages from the UIs of the extension
chrome.runtime.onMessage.addListener((message: Message, sender, response) => {

  switch (message.type) {

    case MessageType.GET_TAB:
      response(sender.tab);
      break;

    case MessageType.NAVIGATE:
      chrome.tabs.update({ url: message.arg.url });
      break;
  }
});

// Insert the tab bar in the page when the page is loading
chrome.webNavigation.onCommitted.addListener(async details => {

  if (details.frameId !== 0) return;

  const tabGroup = await storage.getTabGroupByTabId(details.tabId);

  if (tabGroup) {

    const urlParser = new URL(details.url);
    const urlRegex = new RegExp(`${urlParser.origin + urlParser.pathname}(\\?[^#]*)?(${urlParser.hash})?`);

    const selectedTab = tabGroup.tabs.find(tab => tab.isSelected);
    const tab = tabGroup.tabs.find(tab => urlRegex.test(tab.url));

    await storage.selectTab(selectedTab, false);
    await storage.selectTab(tab, true);

    chrome.tabs.executeScript(tabGroup.tabId, { file: 'tab-bar.js' });
  }
});

// Detach the tab bar from the browser tab when it is closed
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const isAttach = await storage.isBrowserTabAttached(tabId);
  if (isAttach) {
    await storage.detachBrowserTab(tabId);
  }
});


// Listen when the context menu option is clicked
chrome.contextMenus.onClicked.addListener(async (info, browserTab) => {

  const tabGroup = await storage.getTabGroupByTabId(browserTab.id);
  const pageInfo = await getPageInfo(info.linkUrl);

  if (tabGroup) {

    const tab = new Tab(undefined, pageInfo.title, info.linkUrl, tabGroup.id, false, pageInfo.favIconUrl);
    await storage.addTab(tab);

    chrome.tabs.sendMessage(browserTab.id, {
      type: MessageType.TAB_ADDED,
      arg: { tabId: browserTab.id }
    });

  } else {

    const tabGroup = new TabGroup('Temporal', browserTab.id, undefined, undefined, true);
    const currentPageTab = new Tab(undefined, browserTab.title, browserTab.url, tabGroup.id, true, browserTab.favIconUrl);
    const newTab = new Tab(undefined, pageInfo.title, info.linkUrl, tabGroup.id, false, pageInfo.favIconUrl);

    await storage.addTabGroup(tabGroup);
    await storage.addTab(currentPageTab);
    await storage.addTab(newTab);

    chrome.tabs.executeScript(browserTab.id, { file: 'tab-bar.js' });
  }
});

function getPageInfo(url: string): Promise<{ title: string, favIconUrl: string }> {

  return new Promise<{ title: string, favIconUrl: string }>((resolve, reject) => {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = async () => {

      if (XMLHttpRequest.DONE === xhr.readyState) {

        if (xhr.status === 200) {

          const document = xhr.responseXML;
          const title = document.title;
          const favIconUrl = await getFavIconUrl(document);

          resolve({ title, favIconUrl });
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
    favIconUrl = chrome.runtime.getURL(defaultFavicon);
  }

  return favIconUrl;
}
