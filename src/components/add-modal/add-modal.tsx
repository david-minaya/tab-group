import * as React from 'react';
import * as style from './add-modal.css';
import { Icon } from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { TextBox } from '../text-box';
import { Button } from '../button';
import { Storage, LocalStorage, TabGroup, Tab } from '../../storage';
import { getBrowserTab, MessageType } from '../../utils';

initializeIcons();

interface props {
  onCloseModal: () => void;
}

export function AddModal({ onCloseModal }: props) {

  const storage = new Storage(new LocalStorage());
  const [name, setName] = React.useState('');

  function handleTextBoxChange(event: React.FormEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  async function handleAddTabBar(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    const browserTab = await getBrowserTab();
    if (await canCreateTabGroup(browserTab)) {
      await createTabGroup(browserTab);
    }
  }

  async function canCreateTabGroup(browserTab: chrome.tabs.Tab): Promise<boolean> {
    const isNotAttached = !await storage.isBrowserTabAttached(browserTab.id);
    const isValidName = name !== '';
    return isNotAttached && isValidName;
  }

  async function createTabGroup(browserTab: chrome.tabs.Tab) {
    
    const isValidUrl = browserTab.url !== 'edge://newtab/';
    const url = isValidUrl ? browserTab.url : 'https://www.google.com.do';
    
    const tab = new Tab(undefined, browserTab.title, url, undefined, true);
    const tabGroup = new TabGroup(name, browserTab.id, [tab]);
    await storage.addTabGroup(tabGroup);

    // The tab bar is inserted from the background script when the listener
    // chrome.webNavigation.onCommitted is triggered. This listener is triggered
    // when the page is updating.
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  return (
    <div className={style.background} onClick={onCloseModal}>
      <div className={style.modal} onClick={(event) => event.stopPropagation()}>
        <div className={style.title}>Agregar barra de pestañas</div>
        <Icon className={style.close} iconName='cancel' onClick={onCloseModal}/>
        <form className={style.content}>
          <TextBox 
            className={style.textBox} 
            placeholder='Nombre'
            value={name}
            onChange={handleTextBoxChange}/>
          <Button 
            className={style.addButton} 
            text='Agregar' 
            onClick={handleAddTabBar}/>
        </form>
      </div>
    </div>
  );
}
