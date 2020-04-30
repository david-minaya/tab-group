import { Message, MessageType } from './utils';
import { Storage, LocalStorage, TabGroup, Tab } from './storage';

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
      chrome.tabs.update({ url: message.arg.tab.url });
      break;
  }
});

// Insert the tab bar in the page when the page is loading
chrome.webNavigation.onCommitted.addListener(async details => {
  if (details.frameId !== 0) return;
  const tabGroup = await storage.getTabGroupByTabId(details.tabId);
  if (tabGroup) {
    chrome.tabs.executeScript(tabGroup.tabId, { file: 'tab-bar.js' });
  }
});

// Update the title and url of the selected tab when the browser tab is complete loaded
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, { url, favIconUrl }) => {
  const tabGroup = await storage.getTabGroupByTabId(tabId);
  if (tabGroup) {
    chrome.tabs.sendMessage(tabId, {
      type: MessageType.UPDATE_TAB,
      arg: { tabId, url, favIconUrl }
    });
  }
});

// Detach the tab bar from the browser tab when it is closed
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const isAttach = await storage.isBrowserTabAttached(tabId);
  if (isAttach) {
    await storage.detachBrowserTab(tabId);
  }
});


// Listen when the context menu is clicked
chrome.contextMenus.onClicked.addListener(async (info, browserTab) => {

  const tabGroup = await storage.getTabGroupByTabId(browserTab.id);

  if (tabGroup) {

    const tab = new Tab(undefined, undefined, info.linkUrl, tabGroup.id, false);
    sendAddTabMessage(browserTab.id, tab);

  } else {

    const tabGroup = new TabGroup('Temporal', browserTab.id, undefined, undefined, true);
    const tab = new Tab(undefined, undefined, info.linkUrl, tabGroup.id, true, browserTab.favIconUrl);
    await storage.addTabGroup(tabGroup);
    await storage.addTab(tab);

    chrome.tabs.executeScript(browserTab.id, { file: 'tab-bar.js' }, () => {
      console.log('send tab bar added message');
      console.log(Date.now());
      chrome.tabs.sendMessage(browserTab.id, {
        type: MessageType.TAB_BAR_ADDED,
        arg: { tabId: browserTab.id }
      });
    });
  }
});

function sendAddTabMessage(browserTabId: number, tab: Tab) {
  chrome.tabs.sendMessage(browserTabId, {
    type: MessageType.ADD_TAB,
    arg: { tabId: browserTabId, tab }
  });
}
