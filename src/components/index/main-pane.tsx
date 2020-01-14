import * as React from 'react';
import '../../styles/index/main-pane.css';
import { TabGroup } from './tab-group';
import * as Storage from '../../storage';

export function MainPane() {

  const storage = new Storage.Storage(new Storage.LocalStorage());
  const [tabsGroups, setTabsGroups] = React.useState([]);

  React.useEffect(() => {
    getTabsGroups();
  });

  async function getTabsGroups() {
    const tabsGroup = await storage.getTabsGroup();
    setTabsGroups(tabsGroup);
  }

  return (
    <div className='main-pane'>
      <div className='tab-group-list'>
        {
          tabsGroups.map(tabGroup => {
            return <TabGroup key={tabGroup.id} tabGroup={tabGroup} />;
          })
        }
      </div>
    </div>
  );
}
