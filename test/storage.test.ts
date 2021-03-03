// /* eslint-disable no-unused-expressions */
// import { expect } from 'chai';
// import TestStorage from './test-storage';
// import { Storage } from '../src/storage';
// import { TabGroup, Tab } from '../src/models';

// const storage = Storage.init(TestStorage, 'TEST_STORAGE');

// beforeEach(async () => {
//   await storage.tabsGroups.addTabGroup(new TabGroup('1', 1, 'Group 1', [new Tab('id1', 'tab 1', 'url 1', '1')]));
//   await storage.tabsGroups.addTabGroup(new TabGroup('2', 2, 'Group 2', [new Tab('id2', 'tab 2', 'url 2', '2')]));
//   await storage.tabsGroups.addTabGroup(new TabGroup('3', 3, 'Group 3', [new Tab('id3', 'tab 3', 'url 3', '3')]));
// });

// describe('add tab group', () => {

//   beforeEach(async () => {
//     await storage.clear();
//   });

//   it('add tab group with id', async () => {
//     await storage.tabsGroups.addTabGroup(new TabGroup('4', 4, 'Group 4', [new Tab(undefined, 'tab', 'url')]));
//     const [tabGroup] = await storage.tabsGroups.getTabsGroup();
//     const expectedTabGroup = { name: 'Group 4', tabId: 4, id: '4' };
//     const expectedTab = { name: 'tab', url: 'url' };
//     expect(tabGroup).to.contain(expectedTabGroup);
//     expect(tabGroup.tabs[0]).to.contain(expectedTab);
//   });

//   it('add tab group without id', async () => {
//     await storage.tabsGroups.addTabGroup(new TabGroup(undefined, 4, 'Group 4', [new Tab(undefined, 'tab', 'url')]));
//     const [tabGroup] = await storage.tabsGroups.getTabsGroup();
//     const expectedTabGroup = { name: 'Group 4', tabId: 4};
//     const expectedTab = { name: 'tab', url: 'url' };
//     expect(tabGroup).to.contain(expectedTabGroup);
//     expect(tabGroup.id).not.to.be.undefined;
//     expect(tabGroup.tabs[0]).to.contain(expectedTab);
//   });
// });

// it('get tabs group', async () => {
//   const tabsGroup = await storage.tabsGroups.getTabsGroup();
//   const expectedTabsGroup: TabGroup[] = [
//     new TabGroup(undefined, 1, 'Group 1', [new Tab(undefined, 'tab 1', 'url 1')]),
//     new TabGroup(undefined, 2, 'Group 2', [new Tab(undefined, 'tab 2', 'url 2')]),
//     new TabGroup(undefined, 3, 'Group 3', [new Tab(undefined, 'tab 3', 'url 3')])
//   ];
//   tabsGroup.forEach((tabGroup, index) => {
//     const { name, tabId, tabs } = expectedTabsGroup[index];
//     const tab = tabs[0];
//     expect(tabGroup).to.include({ name, tabId });
//     expect(tab).to.include({ name: tab.name, url: tab.url });
//   });
// });

// it('get tab group by id', async () => {
//   const tabGroup = await storage.tabsGroups.getTabGroup('1');
//   const expectedTabGroup = { name: 'Group 1', tabId: 1, id: '1' };
//   const expectedTab = { name: 'tab 1', url: 'url 1' };
//   expect(tabGroup).to.include(expectedTabGroup);
//   expect(tabGroup.tabs[0]).to.include(expectedTab);
// });

// it('get tab group by browser tab id', async () => {
//   const tabGroup = await storage.tabsGroups.getTabGroupByTabId(1);
//   const expectedTabGroup = { name: 'Group 1', tabId: 1, id: '1' };
//   const expectedTab = { name: 'tab 1', url: 'url 1' };
//   expect(tabGroup).to.include(expectedTabGroup);
//   expect(tabGroup.tabs[0]).to.include(expectedTab);
// });

// it('return true if found one tab group with the id of the browser tab', async () => {
//   const isBrowserTabAssigned = await storage.tabsGroups.isBrowserTabAttached(1);
//   expect(isBrowserTabAssigned).to.be.true;
// });

// it('select a tab', async () => {
//   const { tabs } = await storage.tabsGroups.getTabGroup('1');
//   await storage.tabs.selectTab(tabs[0], true);
//   {
//     const { tabs } = await storage.tabsGroups.getTabGroup('1');
//     expect(tabs[0].isSelected).to.be.true;
//   }
// });

// it('delete all the tabs group', async () => {
//   await storage.clear();
//   const tabsGroup = await storage.tabsGroups.getTabsGroup();
//   expect(tabsGroup).to.be.empty;
// });

// it('attach browser tab', async () => {
//   await storage.tabsGroups.detachBrowserTab(1);
//   await storage.tabsGroups.attachBrowserTab('1', 5);
//   const isAttach = await storage.tabsGroups.isBrowserTabAttached(5);
//   expect(isAttach).to.be.true;
// });

// it('detach browser tab of a tab group', async () => {
//   await storage.tabsGroups.detachBrowserTab(1);
//   const isAttach = await storage.tabsGroups.isBrowserTabAttached(1);
//   expect(isAttach).to.be.false;
// });

// it('update tab', async () => {
//   const tab = new Tab('id1', 'tab updated', 'url updated', '1');
//   await storage.tabs.updateTab(tab);
//   const { tabs } = await storage.tabsGroups.getTabGroup('1');
//   const updatedTab = tabs.find(tab => tab.id === 'id1');
//   expect(updatedTab).to.be.equal(tab);
// });

// it('delete tab', async() => {
  
//   const tabs = [
//     new Tab('id1', 'tab 1', 'url 1', '4'),
//     new Tab('id2', 'tab 2', 'url 2', '4')
//   ];

//   const tabGroup = new TabGroup('4', 4, 'Group 4', tabs);
//   const tab = tabs[0];

//   await storage.tabsGroups.addTabGroup(tabGroup);
//   await storage.tabs.deleteTab(tab);

//   const storedTabGroup = await storage.tabsGroups.getTabGroup(tabGroup.id);
//   const [storedTab] = storedTabGroup.tabs;
//   const expectedTab = new Tab('id2', 'tab 2', 'url 2', '4');

//   expect(storedTab).to.be.include(expectedTab);
// });

// afterEach(async () => {
//   await storage.clear();
// });
