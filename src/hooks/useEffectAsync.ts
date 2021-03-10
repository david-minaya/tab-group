import * as React from 'react';

export function useEffectAsync(callBack: () => void, dependencies?: []) {
  React.useEffect(() => callBack(), dependencies);
}
