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
