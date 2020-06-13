import * as React from 'react';
import * as style from './tab.css';
import * as Storage from '../../storage';
import { Icon } from 'office-ui-fabric-react';
import { MessageType } from '../../utils';
import { Menu } from '../menu';

interface props {
  tab: Storage.Tab;
  onCloseTab: (tab: Storage.Tab) => void;
}

export function Tab({ tab, onCloseTab }: props) {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function handleTabClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    
    const clickedElement = event.target as HTMLElement;
    
    // if the clicked element isn't the menu option
    if (!clickedElement.classList.contains(style.menu)) {
      chrome.runtime.sendMessage({ 
        type: MessageType.NAVIGATE, 
        arg: { url: tab.url } 
      });
    }
  }

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }
 
  return (
    <div className={tab.isSelected ? style.selectedTab : style.tab} onClick={handleTabClick}>
      <img className={style.favicon} title={tab.name} src={tab.favIconUrl}/>
      <div className={style.title} title={tab.name}>{tab.name}</div>
      <Icon className={style.menu} iconName='more' onClick={handleOpenMenu} />
      <Menu 
        isOpen={isMenuOpen} 
        onCloseMenu={handleCloseMenu}/>
    </div>
  );
}
