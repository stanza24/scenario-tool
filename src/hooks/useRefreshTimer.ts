import { useEffect, useRef } from 'react';

import { SmartTimer } from 'lib/smartTimer';
import { useEventListener } from './useEventListener';

export const useRefreshTimer = (
  callback: (...props: any[]) => any,
  getDelay: () => number | null
) => {
  const refreshTimer = useRef<SmartTimer>();

  useEffect(() => {
    refreshTimer.current = new SmartTimer(callback);

    return () => refreshTimer.current?.stop();
  }, [callback]);

  useEffect(() => {
    if (refreshTimer.current) {
      refreshTimer.current?.changeDelay(getDelay());
    }
  }, [getDelay]);

  useEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshTimer.current?.resume();
    } else {
      refreshTimer.current?.pause();
    }
  });

  useEventListener('online', () => {
    refreshTimer.current?.resume();
  });

  useEventListener('offline', () => {
    refreshTimer.current?.pause();
  });
};
