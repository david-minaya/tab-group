import * as React from 'react';
import style from './page-group-item.css';
import { TabGroup } from '../../models';
import { Icons, MessageType } from '../../constants';
import { openInAllTabs, insertTabBar } from '../../utils';
import { useStorage } from '../../hooks';
import { FaviconItem } from '../favicon-item';
import { IconOption } from '../icon-option';
import { Menu } from '../menu';
import { Option } from '../option';
import { EditableTitle } from '../editable-title';

interface Props {
  pageGroup: TabGroup;
}

export function PageGroupItem({ pageGroup }: Props) {

  const storage = useStorage();
  const faviconItemsRef = React.useRef<HTMLDivElement>();
  const pageGroupItemRef = React.useRef<HTMLDivElement>();
  const [disableLeftOption, setDisableLeftOption] = React.useState(true);
  const [disableRightOption, setDisableRightOption] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [isTitleEditable, setTitleEditable] = React.useState(false);

  const handleOpenMenu = () => setIsOpenMenu(true);
  const handleCloseMenu = () => setIsOpenMenu(false);
  const handleDisableTitle = () => setTitleEditable(false);

  async function handleItemClick(event: any) {
    
    const clickedElement = event.target as HTMLElement;
    const tab = await getBrowserTab();
    
    if (clickedElement.dataset.tag === 'icon-option' || !tab.url) return;
    
    await storage.tabGroups.attachBrowserTab(pageGroup.id, tab.id);
    insertTabBar(tab.id);
    window.close();
  }

  async function handleOptionClick(tag: string) {

    switch (tag) {
      case 'open-in-new-tab':
        openInNewTab(pageGroup);
        break;
      case 'open_in_all_tabs':
        await openInAllTabs(pageGroup.id);
        window.close();
        break;
      case 'rename':
        setTitleEditable(true);
        break;
      case 'delete':
        await deleteTabGroup(pageGroup);  
        break;
    }

    setIsOpenMenu(false);
  }

  async function handleTitleChange(title: string) {
    await storage.tabGroups.rename(pageGroup.id, title);
    setTitleEditable(false);
  }

  function openInNewTab(tabGroup: TabGroup) {
    chrome.runtime.sendMessage({ 
      type: MessageType.OPEN_IN_NEW_TAB, 
      arg: { tabGroup } 
    });
  }

  async function deleteTabGroup(tabGroup: TabGroup) {
    await storage.tabGroups.delete(tabGroup.id);
  }

  function scrollTo(num: number) {

    const element = faviconItemsRef.current;
    const left = element.scrollLeft + num;
    
    element.scrollTo({ left, behavior: 'smooth' });

    setDisableLeftOption(left <= 0);
    setDisableRightOption(left >= (pageGroup.tabs.length - 5) * 24);
  }

  function updateMenuPosition(menu: HTMLDivElement) {
    
    const pageGroupItemElement = pageGroupItemRef.current;
    const pageGroupItemRect = pageGroupItemElement.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;
    const menuBottom = pageGroupItemRect.top + menuRect.height + 12;
    
    menu.style.right = `${bodyWidth - (pageGroupItemRect.right - 52)}px`;
    menu.style.top = menuBottom > bodyHeight 
      ? `${pageGroupItemRect.top - (menuRect.height - 34)}px`
      : `${pageGroupItemRect.top + 12}px`;
  }

  function getBrowserTab(): Promise<chrome.tabs.Tab> {
    return new Promise(resolve => {
      const queryInfo = { windowId: chrome.windows.WINDOW_ID_CURRENT, highlighted: true };
      chrome.tabs.query(queryInfo, ([tab]) => resolve(tab));
    });
  }

  return (
    <React.Fragment>
      <div 
        className={style.pageGroupItem}
        ref={pageGroupItemRef}
        onClick={handleItemClick}>
        <EditableTitle
          style={{ title: style.title, editableTitle: style.editableTitle }}
          title={pageGroup.name}
          isEditable={isTitleEditable}
          onTitleChange={handleTitleChange}
          onDisableTitle={handleDisableTitle}/>
        <div 
          className={style.faviconItemContainer}
          onClick={(e) => e.stopPropagation()}>
          <IconOption 
            className={disableLeftOption ? style.scrollOptionDisabled : style.scrollOption} 
            iconName={Icons.CHEVRON_LEFT} 
            isVisible={pageGroup.tabs.length > 5}
            onClick={() => scrollTo(-24)}/>
          <div className={style.faviconItems} ref={faviconItemsRef}>
            {
              pageGroup.tabs.map(tab => (
                <FaviconItem key={tab.id} page={tab}/>
              ))
            }
          </div>
          <IconOption 
            className={disableRightOption ? style.scrollOptionDisabled : style.scrollOption} 
            iconName={Icons.CHEVRON_RIGHT} 
            isVisible={pageGroup.tabs.length > 5}
            onClick={() => scrollTo(24)}/>
        </div>
        <IconOption 
          className={style.iconOption} 
          iconName={Icons.MORE} 
          onClick={handleOpenMenu}/>
        <Menu
          className={style.menu}
          isOpen={isOpenMenu}
          updateMenuPosition={updateMenuPosition}
          onCloseMenu={handleCloseMenu}>
          <Option 
            className={style.option} 
            tag='open-in-new-tab' 
            icon={Icons.OPEN_IN_NEW_TAB} 
            title='Abrir en nueva pestaña'
            onClick={handleOptionClick}/>
          <Option 
            className={style.option} 
            tag='open_in_all_tabs' 
            icon={Icons.TAB_CENTER} 
            title='Abrir en todas las pestañas'
            onClick={handleOptionClick}/>
          <Option 
            className={style.option} 
            tag='rename' 
            icon={Icons.RENAME} 
            title='Cambiar nombre'
            onClick={handleOptionClick}/>
          <Option 
            className={style.option} 
            tag='delete' 
            icon={Icons.DELETE} 
            title='Eliminar'
            onClick={handleOptionClick}/>
        </Menu>      
      </div>
      <div className={style.line}></div>
    </React.Fragment>
  );
}
