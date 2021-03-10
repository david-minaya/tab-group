import * as React from 'react';
import * as Models from '../../models';
import style from './tab-bar.css';
import { MessageType, Icons } from '../../constants';
import { useStorage, useEffectAsync } from '../../hooks';
import { Message, getBrowserTab } from '../../utils';
import { IconOption } from '../icon-option';
import { Menu } from '../menu';
import { Option } from '../option';
import { SaveModal } from '../save-modal';
import { Tab } from '../tab';
import { TabGroup } from '../../models';

export function TabBar() {

  const storage = useStorage();
  const tabBarRef = React.useRef<HTMLDivElement>();
  const [browserTabId, setBrowserTabId] = React.useState<number>();
  const [tabGroup, setTabGroup] = React.useState<undefined|TabGroup>();
  const [openSaveModal, setOpenSaveModal] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleOpenSaveModal = () => setOpenSaveModal(true);
  const handleCloseSaveModal = () => setOpenSaveModal(false);

  useEffectAsync(async () => {
    const { id } = await getBrowserTab();
    const tabGroup = await storage.tabGroups.getByBrowserTabId(id);
    setBrowserTabId(id);
    setTabGroup(tabGroup);
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
        await updateTabGroup();
        break;
    }
  }

  async function updateTabGroup() {
    const tabGroup = await storage.tabGroups.getByBrowserTabId(browserTabId);
    setTabGroup(tabGroup);
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

  async function handleDeleteTab(tab: Models.Tab) {
    
    await storage.tabs.deleteTab(tab);
    
    if (tabGroup.tabs.length > 1) {
    
      chrome.runtime.sendMessage({ 
        type: MessageType.UPDATE_TAB_BAR, 
        arg: { browserTabsId: tabGroup.browserTabsId }
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
    return new Promise((resolve) =>
      chrome.runtime.sendMessage({ 
        type: MessageType.OPEN_IN_ALL_TABS, 
        arg: { tabGroupId: tabGroup.id } 
      }, resolve)
    );
  }

  async function closeTabBar() {

    if (tabGroup.isTemp) {

      const isConfirmed = confirm('Desea cerra la barra de pestañas sin guardarla');
      if (!isConfirmed) return;
      await storage.tabGroups.delete(tabGroup.id);

    } else {

      await storage.tabGroups.detachBrowserTab(browserTabId);
    }

    chrome.runtime.sendMessage({ 
      type: MessageType.CLOSE_TAB_BAR, 
      arg: { browserTabsId: tabGroup.browserTabsId } 
    });
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
            onClick={handleOpenSaveModal}/>
        }
        <IconOption 
          iconName={Icons.MORE} 
          onClick={handleOpenMenu}/>
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
