import * as React from 'react';
import * as style from './page-group-item.css';
import { TabGroup } from '../../models';
import { Icons, STORAGE_NAME } from '../../constants';
import { Storage, LocalStorage } from '../../storage';
import { MessageType } from '../../utils';

import { 
  FaviconItem,
  IconOption,
  Menu,
  Option 
} from '../';

interface props {
  pageGroup: TabGroup;
  onDeletePageGroup: (pageGroupId: string) => void;
}

export function PageGroupItem({ pageGroup, onDeletePageGroup }: props) {

  const storage = React.useMemo(() => Storage.init(LocalStorage, STORAGE_NAME), []);
  const faviconItemsRef = React.useRef<HTMLDivElement>();
  const [disableLeftOption, setDisableLeftOption] = React.useState(true);
  const [disableRightOption, setDisableRightOption] = React.useState(false);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);

  async function handleOpenPageGroup(event: any) {

    const clickedElement = event.target as HTMLElement;

    if (clickedElement.dataset.tag === 'icon-option') return;

    const { id } = await getBrowserTab();
    await storage.tabs.attachBrowserTab(pageGroup.id, id);
    chrome.tabs.executeScript(id, { file: 'tab-bar.js' });
    chrome.tabs.insertCSS(id, { file: 'font-icon.css' });
    window.close();
  }

  function scrollTo(num: number) {

    const element = faviconItemsRef.current;
    const left = element.scrollLeft + num;
    
    element.scrollTo({ left, behavior: 'smooth' });

    setDisableLeftOption(left <= 0);
    setDisableRightOption(left >= (pageGroup.tabs.length - 5) * 24);
  }

  function handleOpenMenu() {
    setIsOpenMenu(true);
  }

  function handleCloseMenu() {
    setIsOpenMenu(false);
  }

  function handleOptionClick(tag: string) {

    switch (tag) {

      case 'open-in-new-tab':
        chrome.runtime.sendMessage({ type: MessageType.OPEN_IN_NEW_TAB, arg: { pageGroup } });
        break;
      case 'delete':
        onDeletePageGroup(pageGroup.id);
        break;
    }
  }

  function calculateMenuPosition(menu: HTMLDivElement, parentRect: DOMRect) {
    
    const menuRect = menu.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;
    const menuBottom = parentRect.top + menuRect.height + 12;
    
    menu.style.right = `${bodyWidth - (parentRect.right - 52)}px`;
    menu.style.top = menuBottom > bodyHeight 
      ? `${parentRect.top - (menuRect.height - 34)}px`
      : `${parentRect.top + 12}px`;
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
        onClick={handleOpenPageGroup}>
        <div className={style.title}>{pageGroup.name}</div>
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
          calculateMenuPosition={calculateMenuPosition}
          onCloseMenu={handleCloseMenu}>
          <Option 
            className={style.option} 
            tag='open-in-new-tab' 
            icon={Icons.OPEN_IN_NEW_TAB} 
            title='Abrir en nueva pestaña'
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
