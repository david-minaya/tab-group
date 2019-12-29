import * as React from 'react';
import '../../styles/tab-group-page/main-pane.css';
import TabGroup from './tab-group';
import * as storage from '../../storage';

export default class MainPane extends React.Component {

  storage: storage.Storage;
  state: { tabsGroup: storage.TabGroup[] };

  constructor(props: any) {
    super(props);
    this.storage = new storage.Storage(new storage.LocalStorage());
    this.state = { tabsGroup: [] };
  }

  async componentDidMount() {
    const tabsGroup = await this.storage.getTabsGroup();
    this.setState({ tabsGroup });
  }

  render() {
    return (
      <div className='main-pane'>
        <div className='tab-group-list'>
          {
            this.state.tabsGroup.map(tabGroup => {
              return <TabGroup key={tabGroup.id} tabGroup={tabGroup}/>;
            })
          }
        </div>
      </div>
    );
  }
}
