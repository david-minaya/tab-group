import * as React from 'react';
import '../styles/popup.css';
import { TextField, PrimaryButton } from 'office-ui-fabric-react';
import Storage from '../storage/storage';
import TabGroup from '../storage/tab-group';
import Tab from '../storage/tab';
import LocalStorage from '../storage/local-storage';

export class Popup extends React.Component {

  storage: Storage
  state: { name: string }

  constructor(props: any) {
    super(props);
    this.state = { name: '' };
    this.storage = new Storage(new LocalStorage());
  }

  componentDidMount() {
    chrome.tabs.onUpdated.addListener(this.onUpdatedTab);
  }

  componentWillUnmount() {
    chrome.tabs.onUpdated.removeListener(this.onUpdatedTab);
  }

  private onUpdatedTab(tabId: Number, changeInfo: any, tab: chrome.tabs.Tab) {
    if (changeInfo.status === 'complete') {
      chrome.tabs.executeScript({ file: 'content-script.js' });
    }
  }

  private handleInputChange = (event: any) => {
    this.setState({ name: event.target.value });
  }

  private handleButtonClick = async () => {
    const browserTab = await this.getBrowserTab();
    const canCreateTabGroup = await this.canCreateTabGroup(browserTab);
    if (!canCreateTabGroup) return;
    await this.createTabGroup(browserTab);
  }

  private async canCreateTabGroup(browserTab: chrome.tabs.Tab): Promise<boolean> {
    const isNotAssigned = !await this.storage.isBrowserTabAssigned(browserTab.id);
    const isValidName = this.state.name !== '';
    return isNotAssigned && isValidName;
  }

  private async createTabGroup(browserTab: chrome.tabs.Tab) {
    const isValidUrl = browserTab.url !== 'edge://newtab/';
    const url = isValidUrl ? browserTab.url : 'https://www.google.com.do';
    const tab = new Tab(browserTab.title, url);
    const tabGroup = new TabGroup(this.state.name, browserTab.id, [tab]);
    await this.storage.addTabGroup(tabGroup);
    this.insertTabBar(isValidUrl, url);
  }

  private insertTabBar(isValidUrl: boolean, url: string) {
    if (isValidUrl) {
      chrome.tabs.executeScript({ file: 'content-script.js' });
    } else {
      chrome.tabs.update({ url: 'https://www.google.com.do' });
    }
    window.close();
  }

  private getBrowserTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      const queryInfo = { windowId: chrome.windows.WINDOW_ID_CURRENT, highlighted: true };
      chrome.tabs.query(queryInfo, ([tab]) => resolve(tab));
    });
  }

  render() {
    return (
      <div className='popup'>
        <div className='title'>Crear nuevo grupo de pestañas</div>
        <TextField className='text-field' placeholder='Nombre' value={this.state.name} onChange={this.handleInputChange}/>
        <PrimaryButton className='button' text='Crear grupo' onClick={this.handleButtonClick}/>
      </div>
    );
  }
}
