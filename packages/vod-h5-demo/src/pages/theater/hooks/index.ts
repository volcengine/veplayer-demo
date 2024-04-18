import { useEffect, useCallback, useState } from 'react';
import type { RefObject } from 'react';

interface IDoubleClickParams {
  ref: RefObject<HTMLElement>;
  latency?: number;
  onSingleClick?: (...args: any) => any;
  onDoubleClick?: (...args: any) => any;
}

/**
 * A simple React hook for differentiating single and double clicks on the same component.
 *
 * @param {RefObject<HTMLElement>} ref Dom node to watch for double clicks
 * @param {number} [latency=300] The amount of time (in milliseconds) to wait before differentiating a single from a double click
 * @param {function} onSingleClick A callback function for single click events
 * @param {function} onDoubleClick A callback function for double click events
 */
export const useDoubleClick = ({
  ref,
  latency = 300,
  onSingleClick = () => null,
  onDoubleClick = () => null,
}: IDoubleClickParams) => {
  useEffect(() => {
    const clickRef = ref.current;
    if (!clickRef) {
      return;
    }
    let clickCount = 0;
    const handleClick = (e: any) => {
      clickCount += 1;

      setTimeout(() => {
        if (clickCount === 1 && onSingleClick) {
          onSingleClick(e);
        } else if (clickCount === 2 && onDoubleClick) {
          onDoubleClick(e);
        }

        clickCount = 0;
      }, latency);
    };

    // Add event listener for click events
    clickRef.addEventListener('click', handleClick, false);

    // Remove event listener
    return () => {
      clickRef.removeEventListener('click', handleClick, false);
    };
  });
};

export const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};
