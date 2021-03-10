import { v4 as uuid } from 'uuid';

export class Tab {
  constructor(
    public id: string = uuid(), 
    public title?: string, 
    public url?: string, 
    public tabGroupId?: string, 
    public isSelected?: boolean, 
    public favIconUrl?: string
  ) {}
}
