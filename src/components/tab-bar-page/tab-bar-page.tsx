import * as React from 'react';
import * as style from './tab-bar-page.css';
import { initializeIcons } from '@uifabric/icons';
import * as Storage from '../../storage';
import { TabGroup } from '../tab-group';

initializeIcons();

export function TabBarPage() {

  const storage = React.useMemo(() => new Storage.Storage(new Storage.LocalStorage()), []); 
  const [tabsGroups, setTabsGroups] = React.useState([]);

  React.useEffect(() => {
    getTabsGroups();
  });

  async function getTabsGroups() {
    const tabsGroups = await storage.getTabsGroup();
    const filteredTabsGroupd = tabsGroups.filter(tabGroup => !tabGroup.isTemp);
    const tabsGroupsRevesed = filteredTabsGroupd.reverse();
    setTabsGroups(tabsGroupsRevesed);
  }

  return (
    <div className={style.index}>
      <div className={style.navigationPane}>
        <div className={style.title}>Tab Group</div>
      </div>
      <div className={style.mainPane}>
        <div className={style.list}>
          {
            tabsGroups.map(tabGroup => {
              return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
            })
          }
        </div>
      </div>
    </div>
  );
}
