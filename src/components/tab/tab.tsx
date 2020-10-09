import * as React from 'react';
import * as style from './tab.css';
import * as Model from '../../models';
import { MessageType, copy } from '../../utils';
import { Menu } from '../menu';
import { Option } from '../option';
import { IconOption } from '../icon-option';

interface props {
  tab: Model.Tab;
  onDeleteTab: (tab: Model.Tab) => void;
}

export function Tab({ tab, onDeleteTab }: props) {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function handleTabClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    
    const clickedElement = event.target as HTMLElement;
    
    // if the clicked element is the menu option return
    if (clickedElement.dataset.tag === 'icon-option') return;

    chrome.runtime.sendMessage({ 
      type: MessageType.NAVIGATE, 
      arg: { url: tab.url } 
    });
  }

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function calculateMenuPosition(menu: HTMLDivElement, parentRect: DOMRect) {
    
    const menuRect = menu.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const leftBoundary = menuRect.width + 12;

    if (parentRect.right > leftBoundary) {
      menu.style.right = `${bodyWidth - parentRect.right}px`;
    } else {
      menu.style.right = `${bodyWidth - leftBoundary}px`;
    }
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
      <IconOption 
        className={style.iconOption} 
        iconName='more' 
        onClick={handleOpenMenu}/>
      <Menu 
        className={style.menu}
        isOpen={isMenuOpen}
        calculateMenuPosition={calculateMenuPosition} 
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
