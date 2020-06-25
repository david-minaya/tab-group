import * as React from 'react';
import * as style from './tab-bar.css';
import * as Storage from '../../storage';
import { Tab } from '../tab/tab';
import { Icon } from 'office-ui-fabric-react';
import { SaveModal } from '../save-modal';
import { MessageType, Message, TitlePrefixer } from '../../utils';
import { Menu } from '../menu';
import { Option } from '../option';

interface props { tabGroup: Storage.TabGroup; }
const storage = new Storage.Storage(new Storage.LocalStorage());

export function TabBar({ tabGroup: initialTabGroup }: props) {

  const [tabGroup, setTabGroup] = React.useState(initialTabGroup);
  const [selectedTab, setSelectedTab] = React.useState(tabGroup.tabs.find(tab => tab.isSelected));
  const [openSaveModal, setOpenSaveModal] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {

    chrome.runtime.onMessage.addListener(menssageListener);
    // prefixBrowserTabTitle();

    return () => {
      chrome.runtime.onMessage.removeListener(menssageListener);
    };
  }, []);

  async function menssageListener({ type, arg }: Message, sender: any, sendResponse: any) {

    const isThisTabGroup = arg.tabId === tabGroup.tabId;

    if (!isThisTabGroup) return;

    switch (type) {

      case MessageType.TAB_ADDED:
        await updateTabGroup();
        break;
    }
  }

  function prefixBrowserTabTitle() {

    const titlePrefixer = new TitlePrefixer(tabGroup.name, () => { });
    titlePrefixer.prefixTitle();

    const observer = new MutationObserver(() => titlePrefixer.prefixTitle());
    const titleElement = document.querySelector('title');
    const filter = { characterData: true, childList: true };
    observer.observe(titleElement, filter);
  }

  function handleOpenSaveModal() {
    setOpenSaveModal(true);
  }

  function handleCloseSaveModal() {
    setOpenSaveModal(false);
  }

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function handleOptionClick(tag: string) {

    switch (tag) {
      case 'close':
        closeTabBar();
        break;
    }

    setIsMenuOpen(false);
  }

  async function handleDeleteTab(deleteTab: Storage.Tab) {

    await storage.deleteTab(deleteTab);

    const { tabs } = tabGroup;
    const isLastTab = tabs[tabs.length - 1].id === deleteTab.id;
    const isOnlyTab = tabs.length === 1;

    if (!deleteTab.isSelected) {

      await updateTabGroup();

    } else if (isLastTab && !isOnlyTab) {

      // Select the before tab
      const beforeIndex = tabs.length - 2;
      const tab = tabs[beforeIndex];
      await selectNewTab(tab);

    } else if (!isOnlyTab) {

      // Select the next tab
      const nextIndex = tabs.findIndex(tab => tab.id === deleteTab.id) + 1;
      const tab = tabs[nextIndex];
      await selectNewTab(tab);

    } else {

      await closeTabBar();
    }
  }

  async function updateTabGroup() {
    const updatedTabGroup = await storage.getTabGroupByTabId(tabGroup.tabId);
    setTabGroup(updatedTabGroup);
    setSelectedTab(updatedTabGroup.tabs.find(tab => tab.isSelected));
  }

  async function selectNewTab(tab: Storage.Tab) {
    await storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url: tab.url } });
  }

  async function closeTabBar() {

    if (tabGroup.isTemp) {
      if (!confirm('Desea cerra la pagina sin guardar la barra de pestañas')) return;
    }

    const url = selectedTab ? selectedTab.url : window.location.href;
    await storage.detachBrowserTab(tabGroup.tabId); // TODO: remove the tab group without refresh the page
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url } });
  }

  return (
    <div className={tabGroup.isTemp ? style.tabBarWithSaveOption : style.tabBar}>
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
        {tabGroup.isTemp &&
          <Icon className={style.saveIcon} iconName='save' onClick={handleOpenSaveModal} />
        }
        <Icon className={style.icon} iconName='more' onClick={handleOpenMenu} />
      </div>
      <SaveModal
        isOpen={openSaveModal}
        tabGroup={tabGroup}
        onCloseModal={handleCloseSaveModal}/>
      <Menu 
        className={style.menu}
        isOpen={isMenuOpen} 
        onCloseMenu={handleCloseMenu}>
        <Option 
          className={style.option} 
          tag='close' 
          icon='cancel' 
          title='Cerrar'
          onClick={handleOptionClick}/>
      </Menu>
    </div>
  );
}
