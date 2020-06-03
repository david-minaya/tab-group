import * as React from 'react';
import * as style from './main-pane.css';
import { TabGroup } from '../tab-group';
import * as Storage from '../../storage';

export function MainPane() {

  const storage = new Storage.Storage(new Storage.LocalStorage());
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
    <div className={style.mainPane}>
      <div className={style.list}>
        {
          tabsGroups.map(tabGroup => {
            return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
          })
        }
      </div>
    </div>
  );
}
