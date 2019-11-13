/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener(function () {

  const tabs = [
    { name: 'Google Translate', url: 'https://translate.google.com.do/', isSelected: false },
    { name: 'YouTube', url: 'https://www.youtube.com/', isSelected: false },
    { name: 'Medium', url: 'https://medium.com/', isSelected: false }
  ];

  chrome.storage.local.set({ tabs: tabs });
});

chrome.runtime.onMessage.addListener((tab, sender, response) => {
  console.log('background -> onMessage -> message: %o', tab);
  chrome.tabs.update({ url: tab.url });
});
