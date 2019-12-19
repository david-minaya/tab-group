import Tab from './tab';

export default class TabGroup {

  id: string;
  tabId: number;
  name: string;
  tabs: Tab[];

  constructor(name: string, tabId: number, tabs: Tab[], id?: string) {
    this.id = id;
    this.name = name;
    this.tabId = tabId;
    this.tabs = tabs;
  }
}
