import { Tab } from './tab';

export class TabGroup {

  static emptyTabGroup = new TabGroup('', 0, [], '');

  id: string;
  tabId: number;
  name: string;
  tabs: Tab[];

  constructor(name?: string, tabId?: number, tabs?: Tab[], id?: string) {
    this.id = id;
    this.name = name;
    this.tabId = tabId;
    this.tabs = tabs;
  }
}
