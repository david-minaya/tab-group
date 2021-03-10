import * as React from 'react';
import * as Model from '../../models';
import style from './tab.css';
import { copy } from '../../utils';
import { MessageType, Icons } from '../../constants';
import { IconOption } from '../icon-option';
import { Menu } from '../menu';
import { Option } from '../option';
import { TextBox } from '../text-box';
import { useStorage } from '../../hooks';

interface props {
  tab: Model.Tab;
  onDeleteTab: (tab: Model.Tab) => void;
}

export function Tab({ tab, onDeleteTab }: props) {

  const storage = useStorage();
  const tabRef = React.useRef<HTMLDivElement>();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [isTitleEditable, setTitleEditable] = React.useState(false);
  const [selectTitleText, setSelectTitleText] = React.useState(false);

  React.useEffect(() => setTitle(tab.title), [tab]);
  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);

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
        setSelectTitleText(true);
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

  async function handleTextBoxKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'Enter':
        await renameTab();
        break;
      case 'Escape':
        unSelectTitle();
        break;
    }
  }

  async function renameTab() {

    if (title.trim() === '') return unSelectTitle();

    await storage.tabs.rename(tab.id, title);
    const tabGroup = await storage.tabGroups.getTabGroup(tab.tabGroupId);
  
    setTitleEditable(false);
    setSelectTitleText(false);

    chrome.runtime.sendMessage({ 
      type: MessageType.UPDATE_TAB_BAR, 
      arg: { browserTabsId: tabGroup.browserTabsId } 
    });
  }

  function unSelectTitle() {
    setTitle(tab.title);
    setTitleEditable(false);
    setSelectTitleText(false);
  }

  return (
    <div 
      className={tab.isSelected ? style.selectedTab : style.tab}
      ref={tabRef} 
      onClick={handleTabClick}>
      <img className={style.favicon} title={tab.title} src={tab.favIconUrl}/>
      <TextBox 
        style={isTitleEditable ? style.editableTitle : style.title} 
        value={title}
        title={!isTitleEditable && title}
        disabled={!isTitleEditable} 
        selectedText={selectTitleText}
        onKeyDown={handleTextBoxKeyDown}
        onClick={e => e.stopPropagation()}
        onChange={e => setTitle(e.currentTarget.value)}
        onBlur={unSelectTitle}/>
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
