export class Tab {

  id: string;
  tabGroupId: string;
  name: string;
  url: string;
  isSelected: boolean

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}
