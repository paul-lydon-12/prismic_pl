import { useCallback, useEffect, useState } from 'react';

import debounce from 'utils/debounce';

import breakpoints from 'styles/breakpoints.module.scss';

const parseMediaSize = (number?: string | null) => {
  if (!number) {
    throw new Error('Could not parse media size');
  }

  const parsedNumber = parseInt(number);
  if (isNaN(parsedNumber)) {
    throw new Error('Could not parse media size');
  }
  return parsedNumber;
};

type Sizes = {
  width: number;
  height: number;
  isDesktop: boolean;
  isMobile: boolean;
};

export const useResize = () => {
  const [sizes, setSizes] = useState<Sizes>({
    width: 0,
    height: 0,
    isMobile: false,
    isDesktop: false,
  });

  const handleResize = useCallback(() => {
    setSizes({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < parseMediaSize(breakpoints.desktop),
      isDesktop: window.innerWidth >= parseMediaSize(breakpoints.desktop),
    });
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 100));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return sizes;
};
