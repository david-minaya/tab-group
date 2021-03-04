import * as React from 'react';
import style from './popup.css';
import { TabGroup } from '../../models';
import { STORAGE_NAME } from '../../constants';
import { PageGroupItem } from '../page-group-item';
import { Storage, LocalStorage } from '../../storage';

import { 
  insertTabBar, 
  MessageType, 
  openInAllTabs 
} from '../../utils';

export function Popup() {

  const storage = React.useMemo(() => Storage.init(LocalStorage, STORAGE_NAME), []);
  const [pageGroups, setPageGroup] = React.useState<TabGroup[]>([]);
  
  React.useEffect(() => {
    updatePageGroups();
  }, []);

  async function updatePageGroups() {
    setPageGroup(await storage.tabGroups.getTabGroups());
  }

  async function handlePageGroupItemClick(pageGroup: TabGroup) {
    const tab = await getBrowserTab();
    if (tab.url != undefined) {
      console.log(tab);
      await storage.tabGroups.attachBrowserTab(pageGroup.id, tab.id);
      insertTabBar(tab.id);
      window.close();
    }
  }

  async function handleOptionsClick(tag: string, tabGroup: TabGroup) {
    switch (tag) {
      case 'open-in-new-tab':
        openInNewTab(tabGroup);
        break;
      case 'open_in_all_tabs':
        await openInAllTabs(tabGroup.id);
        window.close();
        break;
      case 'delete':
        await deleteTabGroup(tabGroup);  
        break;
    }
  }

  function openInNewTab(tabGroup: TabGroup) {
    chrome.runtime.sendMessage({ 
      type: MessageType.OPEN_IN_NEW_TAB, 
      arg: { tabGroup } 
    });
  }

  async function deleteTabGroup(tabGroup: TabGroup) {
    await storage.tabGroups.delete(tabGroup.id);
    await updatePageGroups();
  }

  function getBrowserTab(): Promise<chrome.tabs.Tab> {
    return new Promise(resolve => {
      const queryInfo = { windowId: chrome.windows.WINDOW_ID_CURRENT, highlighted: true };
      chrome.tabs.query(queryInfo, ([tab]) => resolve(tab));
    });
  }

  return (
    <div className={style.popup}>
      <div className={style.header}>
        <div className={style.title}>Grupos de paginas</div>
      </div>
      <div className={style.pageGroups}>
        {
          pageGroups.map(pageGroup => (
            <PageGroupItem 
              key={pageGroup.id} 
              pageGroup={pageGroup}
              onClick={handlePageGroupItemClick}
              onOptionsClick={handleOptionsClick}/>
          ))
        }
      </div>
    </div>
  );
}
