import * as React from 'react';
import * as Model from '../../models';
import style from './tab.css';
import { copy } from '../../utils';
import { MessageType, Icons } from '../../constants';
import { IconOption } from '../icon-option';
import { Menu } from '../menu';
import { Option } from '../option';
import { EditableTitle } from '../editable-title';
import { useStorage } from '../../hooks';

interface props {
  tab: Model.Tab;
  onDeleteTab: (tab: Model.Tab) => void;
}

export function Tab({ tab, onDeleteTab }: props) {

  const storage = useStorage();
  const tabRef = React.useRef<HTMLDivElement>();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isTitleEditable, setTitleEditable] = React.useState(false);

  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleDisableTitle = () => setTitleEditable(false);

  function handleTabClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    
    const clickedElement = event.target as HTMLElement;
    
    // if the clicked element is the menu option return
    if (clickedElement.dataset.tag === 'icon-option') return;

    chrome.runtime.sendMessage({ 
      type: MessageType.NAVIGATE, 
      arg: { url: tab.url } 
    });
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
      case 'rename':
        setTitleEditable(true);
        break;
      case 'copytitle':
        copy(tab.title);
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

  async function handleTitleChange(title: string) {

    await storage.tabs.rename(tab.id, title);
    const tabGroup = await storage.tabGroups.getTabGroup(tab.tabGroupId);
  
    setTitleEditable(false);

    chrome.runtime.sendMessage({ 
      type: MessageType.UPDATE_TAB_BAR, 
      arg: { browserTabsId: tabGroup.browserTabsId } 
    });
  }

  return (
    <div 
      className={tab.isSelected ? style.selectedTab : style.tab}
      ref={tabRef} 
      onClick={handleTabClick}>
      <img className={style.favicon} title={tab.title} src={tab.favIconUrl}/>
      <EditableTitle
        style={{ title: style.title, editableTitle: style.editableTitle }}
        title={tab.title}
        isEditable={isTitleEditable}
        onTitleChange={handleTitleChange}
        onDisableTitle={handleDisableTitle}/>
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
          tag='rename' 
          icon={Icons.RENAME} 
          title='Cambiar nombre'
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
