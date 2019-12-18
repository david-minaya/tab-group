/*eslint-disable no-unused-expressions*/
import { expect } from 'chai';
import TestStorage from './test-storage';
import Storage from '../src/storage/storage';
import TabGroup from '../src/storage/tab-group';
import Tab from '../src/storage/tab';

const storage = new Storage(new TestStorage());

beforeEach(async () => {
  await storage.addTabGroup(new TabGroup('Group 1', 1, [new Tab('tab 1', 'url 1')], '1'));
  await storage.addTabGroup(new TabGroup('Group 2', 2, [new Tab('tab 2', 'url 2')], '2'));
  await storage.addTabGroup(new TabGroup('Group 3', 3, [new Tab('tab 3', 'url 3')], '3'));
});

describe('add tab group', () => {

  beforeEach(async () => {
    await storage.clear();
  });

  it('add tab group with id', async () => {
    await storage.addTabGroup(new TabGroup('Group 4', 4, [new Tab('tab', 'url')], '4'));
    const [tabGroup] = await storage.getTabsGroup();
    const expectedTabGroup = { name: 'Group 4', tabId: 4, id: '4' };
    const expectedTab = { name: 'tab', url: 'url' };
    expect(tabGroup).to.contain(expectedTabGroup);
    expect(tabGroup.tabs[0]).to.contain(expectedTab);
  });

  it('add tab group without id', async () => {
    await storage.addTabGroup(new TabGroup('Group 4', 4, [new Tab('tab', 'url')]));
    const [tabGroup] = await storage.getTabsGroup();
    const expectedTabGroup = { name: 'Group 4', tabId: 4};
    const expectedTab = { name: 'tab', url: 'url' };
    expect(tabGroup).to.contain(expectedTabGroup);
    expect(tabGroup.id).not.to.be.undefined;
    expect(tabGroup.tabs[0]).to.contain(expectedTab);
  });
});

it('get tabs group', async () => {
  const tabsGroup = await storage.getTabsGroup();
  const expectedTabsGroup: TabGroup[] = [
    new TabGroup('Group 1', 1, [new Tab('tab 1', 'url 1')]),
    new TabGroup('Group 2', 2, [new Tab('tab 2', 'url 2')]),
    new TabGroup('Group 3', 3, [new Tab('tab 3', 'url 3')])
  ];
  tabsGroup.forEach((tabGroup, index) => {
    const { name, tabId, tabs } = expectedTabsGroup[index];
    const tab = tabs[0];
    expect(tabGroup).to.include({ name, tabId });
    expect(tab).to.include({ name: tab.name, url: tab.url });
  });
});

it('get tab group by id', async () => {
  const tabGroup = await storage.getTabGroup('1');
  const expectedTabGroup = { name: 'Group 1', tabId: 1, id: '1' };
  const expectedTab = { name: 'tab 1', url: 'url 1' };
  expect(tabGroup).to.include(expectedTabGroup);
  expect(tabGroup.tabs[0]).to.include(expectedTab);
});

it('get tab group by browser tab id', async () => {
  const tabGroup = await storage.getTabGroupByTabId(1);
  const expectedTabGroup = { name: 'Group 1', tabId: 1, id: '1' };
  const expectedTab = { name: 'tab 1', url: 'url 1' };
  expect(tabGroup).to.include(expectedTabGroup);
  expect(tabGroup.tabs[0]).to.include(expectedTab);
});

it('return true if found one tab group with the id of the browser tab', async () => {
  const isBrowserTabAssigned = await storage.isBrowserTabAssigned(1);
  expect(isBrowserTabAssigned).to.be.true;
});

it('select the tab passed as argument', async () => {
  const { tabs } = await storage.getTabGroup('1');
  await storage.selectTab(tabs[0]);
  {
    const { tabs } = await storage.getTabGroup('1');
    expect(tabs[0].isSelected).to.be.true;
  }
});

it('delete all the tabs group', async () => {
  await storage.clear();
  const tabsGroup = await storage.getTabsGroup();
  expect(tabsGroup).to.be.empty;
});

afterEach(async () => {
  await storage.clear();
});
