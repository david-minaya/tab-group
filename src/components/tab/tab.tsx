import * as React from 'react';
import * as style from './tab.css';
import * as Storage from '../../storage';
import { Icon } from 'office-ui-fabric-react';
import { MessageType, copy } from '../../utils';
import { Menu } from '../menu';
import { Option } from '../option';

interface props {
  tab: Storage.Tab;
  onDeleteTab: (tab: Storage.Tab) => void;
}

export function Tab({ tab, onDeleteTab }: props) {

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

  function handleOptionClick(tag: string) {

    switch (tag) {

      case 'openinnewtab':
        window.open(tab.url, '_blank');
        break;
      case 'copytitle':
        copy(tab.name);
        break;
      case 'copylink':
        copy(tab.url);
        break;
      case 'delete':
        onDeleteTab(tab);
        break;
    }

    setIsMenuOpen(false);
  }

  return (
    <div className={tab.isSelected ? style.selectedTab : style.tab} onClick={handleTabClick}>
      <img className={style.favicon} title={tab.name} src={tab.favIconUrl}/>
      <div className={style.title} title={tab.name}>{tab.name}</div>
      <Icon className={style.menu} iconName='more' onClick={handleOpenMenu}/>
      <Menu 
        isOpen={isMenuOpen} 
        onCloseMenu={handleCloseMenu}>
        <Option 
          className={style.option} 
          tag='openinnewtab' 
          icon='openInNewTab' 
          title='Abrir en nueva pestaña'
          onClick={handleOptionClick}/>
        <Option 
          className={style.option} 
          tag='copytitle' 
          icon='copy' 
          title='Copiar titulo'
          onClick={handleOptionClick}/>
        <Option 
          className={style.option} 
          tag='copylink' 
          icon='copy' 
          title='Copiar enlace'
          onClick={handleOptionClick}/>
        <Option 
          className={style.option} 
          tag='delete' 
          icon='delete' 
          title='Eliminar'
          onClick={handleOptionClick}/>
      </Menu>
    </div>
  );
}
