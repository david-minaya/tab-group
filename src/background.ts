import { PageInfo } from './types';
import { Message, MessageType } from './utils';
import { Storage, LocalStorage, TabGroup, Tab } from './storage';
import defaultFavicon from './images/default-favicon.svg';

const storage = new Storage(new LocalStorage());

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
  const url = info.linkUrl ? info.linkUrl : info.pageUrl;
  const enableMetaRedirect = Boolean(info.linkUrl);
  const pageInfo = await getPageInfo(url, enableMetaRedirect);

  if (tabGroup) {
    
    const tab = new Tab(undefined, pageInfo.title, pageInfo.url, tabGroup.id, false, pageInfo.favicon);
    await storage.addTab(tab);

    chrome.tabs.sendMessage(browserTab.id, {
      type: MessageType.TAB_ADDED,
      arg: { tabId: browserTab.id }
    });

  } else {

    const tabGroup = new TabGroup('Temporal', browserTab.id, undefined, undefined, true);
    const tab = new Tab(undefined, pageInfo.title, pageInfo.url, tabGroup.id, false, pageInfo.favicon);
    
    await storage.addTabGroup(tabGroup);
    await storage.addTab(tab);

    chrome.tabs.executeScript(browserTab.id, { file: 'tab-bar.js' });
  }
});

function getPageInfo(url: string, enableMetaRedirect: boolean): Promise<PageInfo> {

  return new Promise<PageInfo>((resolve, reject) => {

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
    favIconUrl = defaultFavicon;
  }

  return favIconUrl;
}

// TODO: Evitar que la pagina se cierre si la barra de pestañas no se ha guardado
// TODO: Remover el prefijado de las pestañas del navegador DONE
// TODO: Agregar la pagina de google como pestaña  DONE
// TODO: Eliminar la 1ra y la 2da opcion del popup y agregar la opcion abrir barra de pestañas
// TODO: Agregar el menu de opciones a los grupos de pestañas en la pagina de pestañas
//       Con la opcion eliminar
