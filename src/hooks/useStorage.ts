import { useMemo } from 'react';
import { STORAGE_NAME } from '../constants';
import { LocalStorage, Storage } from '../storage';

export function useStorage() {
  return useMemo(() => Storage.init(LocalStorage, STORAGE_NAME), []);
}
