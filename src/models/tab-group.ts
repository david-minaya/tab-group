import { Tab } from './tab';
import { v4 as uuid } from 'uuid';

export class TabGroup {
  constructor(
    public id: string = uuid(), 
    public browserTabsId: number[] = [],
    public name?: string, 
    public tabs: Tab[] = [],
    public isTemp = false
  ) { }
}
