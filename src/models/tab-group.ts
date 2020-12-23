import { Tab } from './tab';
import { v4 as uuid } from 'uuid';

export class TabGroup {

  static emptyTabGroup = new TabGroup('', 0, [], '');

  id: string;
  tabId: number;
  name: string;
  tabs: Tab[];
  isTemp: boolean;

  constructor(
    name?: string, tabId?: number, tabs: Tab[] = [], 
    id: string = uuid(), isTemp = false
  ) {
    this.id = id;
    this.name = name;
    this.tabId = tabId;
    this.tabs = tabs;
    this.isTemp = isTemp;
  }
}
