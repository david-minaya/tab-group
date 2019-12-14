import { expect } from 'chai';
import TestStorage from './test-storage';
import Storage from '../src/storage/storage';
import TabGroup from '../src/storage/tab-group';
import Tab from '../src/storage/tab';

it('add tab group', async () => {
  const storage = new Storage(new TestStorage());
  await storage.addTabGroup(new TabGroup('Group 1', 0, [new Tab('tab', 'url')]));
  const tabGroup = await storage.getTabGroupByTabId(0);
  expect(tabGroup.name).to.equal('Group 1');
});
