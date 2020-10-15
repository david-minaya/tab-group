import * as React from 'react';
import * as style from './tab-bar-page.css';
import { Storage, LocalStorage } from '../../storage';
import { TabGroup } from '../tab-group';
import { Context } from '../../context';
import { STORAGE_NAME } from '../../constants';

export function TabBarPage() {

  const storage = React.useMemo(() => Storage.init(LocalStorage, STORAGE_NAME), []); 
  const [tabsGroups, setTabsGroups] = React.useState([]);

  React.useEffect(() => {
    getTabsGroups();
  }, []);

  async function getTabsGroups() {
    const tabsGroups = await storage.tabsGroups.getTabsGroup();
    const filteredTabsGroupd = tabsGroups.filter(tabGroup => !tabGroup.isTemp);
    const tabsGroupsRevesed = filteredTabsGroupd.reverse();
    setTabsGroups(tabsGroupsRevesed);
  }

  async function handleUpdate() {
    await getTabsGroups();
  }

  return (
    <Context.Provider value={{ storage }}>
      <div className={style.index}>
        <div className={style.navigationPane}>
          <div className={style.title}>Tab Group</div>
        </div>
        <div className={style.mainPane}>
          <div className={style.list}>
            {
              tabsGroups.map(tabGroup => {
                return (
                  <TabGroup 
                    key={tabGroup.id} 
                    tabGroup={tabGroup}
                    onUpdate={handleUpdate}/>
                );
              })
            }
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}
