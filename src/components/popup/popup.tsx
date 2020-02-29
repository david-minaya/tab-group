import * as React from 'react';
import '../../styles/popup/popup.css';
import { TextField, PrimaryButton } from 'office-ui-fabric-react';
import { Storage, LocalStorage, TabGroup, Tab } from '../../storage';

export function Popup() {

  const storage = new Storage(new LocalStorage());
  const [name, setName] = React.useState('');

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

    // The tab bar is inserted from the background script when the listener
    // chrome.webNavigation.onCommitted is triggered. This listener is triggered
    // when the page is updating.
    chrome.tabs.update({ url });
    
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
