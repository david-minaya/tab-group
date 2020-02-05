import * as React from 'react';
import '../../styles/popup/popup.css';
import { TextField, PrimaryButton } from 'office-ui-fabric-react';
import { Storage, LocalStorage, TabGroup, Tab } from '../../storage';

export function Popup() {

  const storage = new Storage(new LocalStorage());
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    chrome.tabs.onUpdated.addListener(onUpdatedTab);
    return () => {
      chrome.tabs.onUpdated.removeListener(onUpdatedTab);
    };
  });

  function onUpdatedTab(tabId: Number, changeInfo: any, tab: chrome.tabs.Tab) {
    if (changeInfo.status === 'complete') {
      chrome.tabs.executeScript({ file: 'content-script.js' });
    }
  }

  function handleInputChange(event: any) {
    setName(event.target.value);
  }

  async function handleButtonClick() {
    const browserTab = await getBrowserTab();
    if (!await canCreateTabGroup(browserTab)) return;
    await createTabGroup(browserTab);
  }

  async function canCreateTabGroup(browserTab: chrome.tabs.Tab): Promise<boolean> {
    const isNotAttached = !await storage.isBrowserTabAttached(browserTab.id);
    const isValidName = name !== '';
    return isNotAttached && isValidName;
  }

  async function createTabGroup(browserTab: chrome.tabs.Tab) {
    const isValidUrl = browserTab.url !== 'edge://newtab/';
    const url = isValidUrl ? browserTab.url : 'https://www.google.com.do';
    const tab = new Tab(undefined, browserTab.title, url);
    const tabGroup = new TabGroup(name, browserTab.id, [tab]);
    await storage.addTabGroup(tabGroup);
    insertTabBar(isValidUrl, url);
  }

  function insertTabBar(isValidUrl: boolean, url: string) {
    if (isValidUrl) {
      chrome.tabs.executeScript({ file: 'content-script.js' });
    } else {
      chrome.tabs.update({ url: 'https://www.google.com.do' });
    }
    window.close();
  }

  function getBrowserTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      const queryInfo = { windowId: chrome.windows.WINDOW_ID_CURRENT, highlighted: true };
      chrome.tabs.query(queryInfo, ([tab]) => resolve(tab));
    });
  }

  function handleOpenPageButtonClick() {
    window.open(chrome.runtime.getURL('index.html'));
  }

  return (
    <div className='popup'>
      <div className='title'>Crear nuevo grupo de pestañas</div>
      <TextField className='text-field' placeholder='Nombre' value={name} onChange={handleInputChange} />
      <PrimaryButton className='button' text='Crear grupo' onClick={handleButtonClick} />
      <PrimaryButton className='button' text='Open page' onClick={handleOpenPageButtonClick} />
    </div>
  );
}
