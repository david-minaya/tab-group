export function insertTabBar(browserTabId: number) {
  chrome.tabs.executeScript(browserTabId, { file: 'tab-bar.js' });
  chrome.tabs.insertCSS(browserTabId, { file: 'tab-bar.css' });
}
