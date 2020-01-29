export class Tab {

  id: string;
  tabGroupId: string;
  name: string;
  url: string;
  isSelected: boolean;
  favIconUrl: string;

  constructor(
    id?: string, name?: string, url?: string, 
    tabGroupId?: string, isSelected?: boolean, favIconUrl?: string
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.tabGroupId = tabGroupId;
    this.isSelected = isSelected;
    this.favIconUrl = favIconUrl;
  }
}
