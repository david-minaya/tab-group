import * as React from 'react';
import * as style from './tab-group.css';
import * as Model from '../../models';
import { Storage } from '../../storage';
import { TabItem } from '../tab-item';
import { MessageType } from '../../utils';
import { Menu } from '../menu';
import { Option } from '../option';
import { Icons } from '../../constants';
import { IconOption } from '../icon-option';
import { Context } from '../../context';

interface props {
  tabGroup: Model.TabGroup;
  onUpdate: () => void;
}

export function TabGroup({ tabGroup, onUpdate }: props) {
  
  const { storage } = React.useContext<{ storage: Storage }>(Context);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function handleOpenInNewTab() {

    const selectedTab = tabGroup.tabs.find(tab => tab.isSelected) || tabGroup.tabs[0];
    const createProperties = { url: selectedTab.url };

    chrome.tabs.create(createProperties, async browserTab => {

      await storage.tabs.attachBrowserTab(tabGroup.id, browserTab.id);

      // The tab bar is inserted from the background script when the listener
      // chrome.webNavigation.onCommitted is triggered. This listener is triggered
      // when the page is updating. This line send a message to the background 
      // script to update the page.
      chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url: selectedTab.url } });
    });
  }

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  async function handleOptionClick(tag: string) {

    switch (tag) {
      case 'delete':
        await storage.tabsGroups.deleteTabGroup(tabGroup.id);
        onUpdate();
        break;
    }

    setIsMenuOpen(false);
  }

  return (
    <div className={style.tabGroup}>
      <div className={style.topBar}>
        <div className={style.title}>{tabGroup.name}</div>
        <div className={style.options}>
          <IconOption iconName={Icons.OPEN_IN_NEW_TAB} onClick={handleOpenInNewTab} />
          <IconOption iconName={Icons.MORE} onClick={handleOpenMenu} />
        </div>
      </div>
      <div className={style.list}>
        {
          tabGroup.tabs.map(tab => {
            return <TabItem key={tab.id} tab={tab} />;
          })
        }
      </div>
      <Menu 
        className={style.menu}
        isOpen={isMenuOpen}
        onCloseMenu={handleCloseMenu}>
        <Option
          tag='delete' 
          icon={Icons.DELETE} 
          title='Borrar'
          onClick={handleOptionClick}/>
      </Menu>
    </div>
  );
}
