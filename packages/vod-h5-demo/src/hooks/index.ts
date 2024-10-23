/*
 * Copyright 2024 Beijing Volcano Engine Technology Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
