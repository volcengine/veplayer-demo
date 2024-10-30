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

import React from 'react';
import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import Square from './pages/square';
import Theater from './pages/theater';
import PlayletIcon from './assets/svg/playlet.svg?react';

interface IChild {
  path: string;
  key: string;
  element: ReactNode;
}

interface IFeat {
  name: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  key: string;
  path: string;
  jump: string;
  pages?: IChild[];
}

export const featureList: IFeat[] = [
  {
    name: '短剧',
    icon: PlayletIcon,
    key: 'playlet',
    path: 'playlet',
    jump: '/playlet/square',
    pages: [
      {
        path: 'square',
        key: 'square',
        element: <Square />,
      },
      {
        path: 'theater',
        key: 'theater',
        element: <Theater />,
      },
    ],
  },
];

function genRoutes(list: IFeat[] = []): RouteObject[] {
  return list.reduce((pre: RouteObject[], cur) => {
    const { path: parentPath, pages = [] } = cur;
    const children = pages.map(childItem => {
      return {
        ...childItem,
        path: parentPath + '/' + childItem.path,
      };
    });
    return [...pre, ...children];
  }, []);
}

export const featRoutes = genRoutes(featureList);
