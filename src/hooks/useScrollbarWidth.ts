import { useEffect, useState } from 'react';

export function useScrollbarWidth() {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const scrollEl = document.createElement('div');
    scrollEl.style.cssText =
      'position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll;';
    document.body.appendChild(scrollEl);
    const scrollbarWidth = scrollEl.getBoundingClientRect().width - scrollEl.clientWidth;
    document.body.removeChild(scrollEl);

    setScrollbarWidth(scrollbarWidth);
  }, []);

  return scrollbarWidth;
}
