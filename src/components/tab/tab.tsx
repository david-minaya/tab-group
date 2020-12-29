import * as React from 'react';
import style from './tab.css';
import * as Model from '../../models';
import { MessageType, copy } from '../../utils';
import { Icons } from '../../constants';
import { IconOption } from '../icon-option';
import { Menu } from '../menu';
import { Option } from '../option';

interface props {
  tab: Model.Tab;
  onDeleteTab: (tab: Model.Tab) => void;
}

export function Tab({ tab, onDeleteTab }: props) {

  const tabRef = React.useRef<HTMLDivElement>();
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

  function updateMenuPosition(menu: HTMLDivElement) {
    
    const tabRect = tabRef.current.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const leftBoundary = menuRect.width + 12;

    menu.style.right = tabRect.right > leftBoundary
      ? `${bodyWidth - tabRect.right}px`
      : `${bodyWidth - leftBoundary}px`;
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
    <div 
      className={tab.isSelected ? style.selectedTab : style.tab}
      ref={tabRef} 
      onClick={handleTabClick}>
      <img className={style.favicon} title={tab.name} src={tab.favIconUrl}/>
      <div className={style.title} title={tab.name}>{tab.name}</div>
      <IconOption 
        className={style.iconOption} 
        iconName={Icons.MORE} 
        onClick={handleOpenMenu}/>
      <Menu 
        className={style.menu}
        isOpen={isMenuOpen}
        updateMenuPosition={updateMenuPosition} 
        onCloseMenu={handleCloseMenu}>
        <Option 
          className={style.option} 
          tag='openinnewtab' 
          icon={Icons.OPEN_IN_NEW_TAB} 
          title='Abrir en nueva pestaña'
          onClick={handleOptionClick}/>
        <Option 
          className={style.option} 
          tag='copytitle' 
          icon={Icons.COPY} 
          title='Copiar titulo'
          onClick={handleOptionClick}/>
        <Option 
          className={style.option} 
          tag='copylink' 
          icon={Icons.COPY} 
          title='Copiar enlace'
          onClick={handleOptionClick}/>
        <Option 
          className={style.option} 
          tag='delete' 
          icon={Icons.DELETE} 
          title='Eliminar'
          onClick={handleOptionClick}/>
      </Menu>
    </div>
  );
}
