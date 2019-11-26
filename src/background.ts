/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener(function () {

  const tabsGroup = {
    id: 1,
    tabId: 0,
    tabs: [
      { name: 'Google Translate', url: 'https://translate.google.com.do/', isSelected: false },
      { name: 'YouTube', url: 'https://www.youtube.com/', isSelected: false },
      { name: 'Medium', url: 'https://medium.com/', isSelected: false }
    ]
  };

  chrome.storage.local.set({ tabsGroup });

  chrome.tabs.create({url: 'https://www.google.com'}, tab => {
    chrome.storage.local.get('tabsGroup', result => {
      const tabGroup = result.tabsGroup;
      tabGroup.tabId = tab.id;
      chrome.storage.local.set({ tabsGroup: tabGroup });
    });
    chrome.tabs.executeScript(tab.id, { file: 'content-script.js'});
  });
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.id === 2) {
    chrome.tabs.update({ url: message.tab.url });
  }
});

chrome.webNavigation.onCommitted.addListener(details => {
  if (details.frameId !== 0) return;
  chrome.storage.local.get('tabsGroup', result => {
    const tabGroup = result.tabsGroup;
    if (details.tabId === tabGroup.tabId) {
      chrome.tabs.executeScript(details.tabId, { file: 'content-script.js'});
    }
  });
});
