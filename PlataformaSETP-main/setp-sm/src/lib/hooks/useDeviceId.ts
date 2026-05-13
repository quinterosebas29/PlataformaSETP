'use client';

import { useState, useEffect } from 'react';
import { getOrCreateDeviceId } from '../deviceId';

export function useDeviceId(): string | null {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  return deviceId;
}
