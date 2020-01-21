export class Tab {

  id: string;
  tabGroupId: string;
  name: string;
  url: string;
  isSelected: boolean

  constructor(id?: string, name?: string, url?: string, tabGroupId?: string, isSelected?: boolean) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.tabGroupId = tabGroupId;
    this.isSelected = isSelected;
  }
}
