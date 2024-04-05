import { useEffect, useRef } from 'react';

// Examples:

// single key
// useKeyDown('Escape', handler);

// multiple keys
// useKeyDown(['ArrowLeft', 'ArrowRight'], (event) => {
//  switch (event.key) {
//    case 'ArrowLeft':
//     console.log('left');
//   break;
//   case 'ArrowRight':
//     console.log('right');
//   break;
//  }
// });

// control key
// useKeyDown('C', handler, true);
export const useKeyDown = (
  keys: KeyboardEvent['key'] | Array<KeyboardEvent['key']>,
  handler: (event?: KeyboardEvent) => void,
  controlClick?: boolean
) => {
  const savedCallback = useRef<(event: KeyboardEvent) => void>();

  useEffect(() => {
    savedCallback.current = (event: KeyboardEvent) => {
      const args = Array.isArray(keys) ? event : undefined;

      if (Array.isArray(keys) ? keys.includes(event.key) : keys === event.key) {
        if (controlClick) {
          if (event.ctrlKey) {
            handler(args);
          }
        } else {
          handler(args);
        }
      }
    };
  }, [keys, handler, controlClick]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      savedCallback.current?.(event);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
