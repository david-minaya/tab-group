import { Tab } from './tab';
import * as uuid from 'uuid/v4';

export class TabGroup {

  static emptyTabGroup = new TabGroup('', 0, [], '');

  id: string;
  tabId: number;
  name: string;
  tabs: Tab[];
  isTemp: boolean;

  constructor(
    name?: string, tabId?: number, tabs: Tab[] = [], 
    id: string = uuid(), isTemp: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.tabId = tabId;
    this.tabs = tabs;
    this.isTemp = isTemp;
  }
}
