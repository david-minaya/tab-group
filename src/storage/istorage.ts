import { TabGroup } from '../models/tab-group';
import { LocalStorage } from './local-storage';

export interface IStorage {
  get<T>(key: string): Promise<T[]>;
  set<T>(key: string, data: T[]): Promise<void>;
  clear(): Promise<void>;
}
