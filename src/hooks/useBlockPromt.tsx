import { History, Transition } from 'history';
import { useContext, useEffect, useCallback } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export declare type Navigator = Pick<History, 'go' | 'push' | 'replace' | 'createHref' | 'block'>;
interface NavigationContextObject {
  basename: string;
  navigator: Navigator;
  static: boolean;
}

export function useBlocker(blocker: (tx: Transition) => void, when = true) {
  const { navigator } = useContext(NavigationContext) as NavigationContextObject;
  useEffect(() => {
    if (!when) return;
    const unblock = navigator.block(tx => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
}

export function usePrompt(message: string, when = true) {
  const blocker = useCallback(
    tx => {
      if (window.confirm(message)) tx.retry();
    },
    [message],
  );
  useBlocker(blocker, when);
}
