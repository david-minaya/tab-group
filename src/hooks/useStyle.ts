import { useMemo } from 'react';

export function useStyle<T>(defaultStyle: T, overriddenStyle: T): T {
  return useMemo(() => ({ ...defaultStyle, ...overriddenStyle }), []);
}
