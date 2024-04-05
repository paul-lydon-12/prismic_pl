import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal = ({
  children,
  target,
}: {
  children: React.ReactElement;
  target?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    const domEl = document.getElementById(target ?? 'portal-container');

    return domEl ? createPortal(children, domEl) : null;
  } else {
    return null;
  }
};
