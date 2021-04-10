import * as React from 'react';
import { MessageType } from '../constants';
import { Message } from '../utils';

interface MessageListener {
  type: MessageType;
  listener: () => void;
}

export function useMessageListener(...deps: any[]) {

  const messageListeners = React.useMemo<MessageListener[]>(() => [], deps);

  const handleMessage = React.useCallback(({ type }: Message) => {
    for (const messageListener of messageListeners) {
      if (messageListener.type === type) {
        messageListener.listener();
      }
    }
  }, deps);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, deps);

  return (type: MessageType, listener: () => void) => {
    const listenerExists = messageListeners.some(item => item.type === type);
    if (!listenerExists) {
      messageListeners.push({ type, listener });
    }
  };
}
