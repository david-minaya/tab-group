import * as React from 'react';
import style from './popup.css';
import { Storage, LocalStorage } from '../../storage';
import { TabGroup } from '../../models';
import { STORAGE_NAME } from '../../constants';
import { PageGroupItem } from '../';

export function Popup() {

  const storage = React.useMemo(() => Storage.init(LocalStorage, STORAGE_NAME), []);
  const [pageGroups, setPageGroup] = React.useState<TabGroup[]>([]);
  
  React.useEffect(() => {
    getPageGroups();
  }, []);

  async function getPageGroups() {
    setPageGroup(await storage.tabsGroups.getTabsGroup());
  }

  async function handleDeletePageGroup(pageGroupId: string) {
    await storage.tabsGroups.deleteTabGroup(pageGroupId);
    await getPageGroups();
  }

  return (
    <div className={style.popup}>
      <div className={style.header}>
        <div className={style.title}>Grupos de paginas</div>
      </div>
      <div className={style.pageGroups}>
        {
          pageGroups.map(pageGroup => (
            <PageGroupItem 
              key={pageGroup.id} 
              pageGroup={pageGroup}
              onDeletePageGroup={handleDeletePageGroup}/>
          ))
        }
      </div>
    </div>
  );
}
