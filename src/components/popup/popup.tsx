import * as React from 'react';
import style from './popup.css';
import { useStorage } from '../../hooks';
import { PageGroupItem } from '../page-group-item';

export function Popup() {

  const storage = useStorage();
  const [pageGroups, setPageGroups] = React.useState([]);

  React.useEffect(() => {
    updatePageGroups();
  }, []);

  React.useEffect(() => {
    storage.tabGroups.addUpdateListener(updatePageGroups);
    return () => storage.tabGroups.removeUpdateListener(updatePageGroups);
  }, []);

  async function updatePageGroups() {
    setPageGroups(await storage.tabGroups.getTabGroups());
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
              pageGroup={pageGroup}/>
          ))
        }
      </div>
    </div>
  );
}
