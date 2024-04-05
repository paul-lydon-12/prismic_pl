/*
 * Dev tools controller.
 * show / hide dev tool controls (for grid overlay button)
 * ctrl & G toggles [G]rid overlay
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { useKeyDown } from 'hooks/useKeyDown';
import { useLocalStorage } from 'hooks/useLocalStorage';

const LOCAL_STORAGE_KEY_VISIBLE = '_devtoolsActive';

const GridOverlay = dynamic(
  () => import('./GridOverlay').then((mod) => mod.GridOverlay),
  {
    ssr: false,
  }
);

export const Devtools = () => {
  const [isVisible, setVisible] = useLocalStorage(LOCAL_STORAGE_KEY_VISIBLE, false);
  const [active, setActive] = useState(false);

  const handleKeys = () => {
    setVisible(!isVisible);
  };

  useEffect(() => {
    setActive(isVisible ?? false);
  }, [isVisible]);

  useKeyDown('g', handleKeys, true);

  return active ? <GridOverlay /> : null;
};
