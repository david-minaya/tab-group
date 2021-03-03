import * as React from 'react';
import * as Models from '../../models';
import style from './tab-bar.css';
import { Icons } from '../../constants';
import { IconOption } from '../icon-option';
import { Menu } from '../menu';
import { Option } from '../option';
import { SaveModal } from '../save-modal';
import { Tab } from '../tab';
import { LocalStorage, Storage } from '../../storage';
import { STORAGE_NAME } from '../../constants';
import { TabGroup } from '../../models';

import { 
  MessageType, 
  Message, 
  getBrowserTab
} from '../../utils';

export function TabBar() {

  const storage = React.useMemo(() => Storage.init(LocalStorage, STORAGE_NAME), []);
  const tabBarRef = React.useRef<HTMLDivElement>();
  const [browserTabId, setBrowserTabId] = React.useState<number>();
  const [tabGroup, setTabGroup] = React.useState<undefined|TabGroup>();
  const [openSaveModal, setOpenSaveModal] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleOpenSaveModal = () => setOpenSaveModal(true);
  const handleCloseSaveModal = () => setOpenSaveModal(false);

  React.useEffect(() => {
    (async () => { 
      const { id } = await getBrowserTab();
      const tabGroup = await storage.tabsGroups.getByBrowserTabId(id);
      setBrowserTabId(id);
      setTabGroup(tabGroup);
    })();
  }, []);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [browserTabId]);

  async function messageListener({ type }: Message) {
    switch (type) {
      case MessageType.UPDATE_TAB_BAR:
        console.log('UPDATE_TAB_BAR');
        await updateTabGroup();
        break;
    }
  }

  async function updateTabGroup() {
    const tabGroup2 = await storage.tabsGroups.getByBrowserTabId(browserTabId);
    setTabGroup(tabGroup2);
  }

  function updateMenuPosition(menu: HTMLDivElement) {
    
    const tabBarRect = tabBarRef.current.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const leftBoundary = menuRect.width + 12;

    menu.style.right = tabBarRect.right > leftBoundary
      ? `${bodyWidth - tabBarRect.right}px`
      : `${bodyWidth - leftBoundary}px`;
  }

  async function handleDeleteTab(deleteTab: Models.Tab) {
    
    await storage.tabs.deleteTab(deleteTab);
    
    if (tabGroup.tabs.length > 1) {
    
      chrome.runtime.sendMessage({ 
        type: MessageType.TAB_DELETED, 
        arg: { tabGroup } 
      });
    
    } else {
    
      await closeTabBar();
    }
  }

  async function handleOptionClick(tag: string) {
    switch (tag) {
      case 'open_in_all_tabs':
        await openInAllTabs();
        await updateTabGroup();
        break;
      case 'close':
        await closeTabBar();
        break;
    }
    setIsMenuOpen(false);
  } 

  function openInAllTabs(): Promise<void> {
    return new Promise((resolve) => {
      const message = { 
        type: MessageType.OPEN_IN_ALL_TABS, 
        arg: { tabGroupId: tabGroup.id } 
      };
      chrome.runtime.sendMessage(message, resolve);
    });
  }

  async function closeTabBar() {

    if (tabGroup.isTemp) {

      const isConfirmed = confirm('Desea cerra la barra de pestañas sin guardarla');
      if (!isConfirmed) return;
      await storage.tabsGroups.delete(tabGroup.id);

    } else {

      await storage.tabsGroups.detachBrowserTab(browserTabId);
    }

    chrome.runtime.sendMessage({ 
      type: MessageType.CLOSE_TAB_BAR, 
      arg: { tabGroup } 
    });

    // chrome.runtime.sendMessage({ 
    //   type: MessageType.NAVIGATE, 
    //   arg: { url: location.href } 
    // });
  }

  return tabGroup === undefined ? null : (
    <div 
      className={tabGroup.isTemp ? style.tabBarWithSaveOption : style.tabBar}
      ref={tabBarRef}>
      <div className={style.tabs}>
        {
          tabGroup.tabs.map(tab => (
            <Tab
              key={tab.id}
              tab={tab}
              onDeleteTab={handleDeleteTab}/>
          ))
        }
      </div>
      <div className={style.options}>
        { tabGroup.isTemp &&
          <IconOption 
            className={style.saveIcon} 
            iconName={Icons.SAVE} 
            onClick={handleOpenSaveModal} />
        }
        <IconOption 
          iconName={Icons.MORE} 
          onClick={handleOpenMenu} />
      </div>
      <SaveModal
        isOpen={openSaveModal}
        tabGroup={tabGroup}
        onCloseModal={handleCloseSaveModal}/>
      <Menu 
        className={style.menu}
        isOpen={isMenuOpen}
        updateMenuPosition={updateMenuPosition} 
        onCloseMenu={handleCloseMenu}>
        <Option 
          className={style.option} 
          tag='open_in_all_tabs' 
          icon={Icons.TAB_CENTER} 
          title='Abrir en todas las pestañas'
          onClick={handleOptionClick}/>
        <Option 
          className={style.option} 
          tag='close' 
          icon={Icons.CANCEL} 
          title='Cerrar'
          onClick={handleOptionClick}/>
      </Menu>
    </div>
  );
}
