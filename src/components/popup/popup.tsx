import * as React from 'react';
import * as style from './popup.css';
import { Option } from '../option';

export function Popup() {

  async function handleOpenAddModal() {
    const browserTab = await getBrowserTab();
    chrome.tabs.executeScript(browserTab.id, { file: 'add-modal.js' });
    window.close();
  }

  function getBrowserTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      const queryInfo = { windowId: chrome.windows.WINDOW_ID_CURRENT, highlighted: true };
      chrome.tabs.query(queryInfo, ([tab]) => resolve(tab));
    });
  }

  function handleOpenPageButtonClick() {
    window.open(chrome.runtime.getURL('tab-bar-page.html'));
  }

  return (
    <div className={style.popup}>
      <div className={style.title}>Grupo de pestañas</div>
      <div className={style.options}>
        <Option icon="addin" title="Create tab group" onClick={handleOpenAddModal}/>
        <Option icon="openinnewtab" title="Open tab group page" onClick={handleOpenPageButtonClick}/>
        <Option icon="pageadd" title="Add page to a tab group"/>
      </div>
    </div>
  );
}
