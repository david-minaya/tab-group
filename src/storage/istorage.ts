export interface IStorage {
  get<T>(key: string): Promise<T[]>;
  set<T>(key: string, data: T[]): Promise<void>;
  clear(): Promise<void>;
}
