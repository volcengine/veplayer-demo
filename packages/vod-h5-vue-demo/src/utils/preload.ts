/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import { IVideoDataWithModel, IPreloadStream } from '@/typings';
import { selectDef } from './index';

/**
 * 格式化预加载流列表
 * 返回格式与VePlayer预加载格式一致的列表
 */
export const formatPreloadList = (list: Array<IVideoDataWithModel>): IPreloadStream[] => {
  if (!list || !list.length) return [];

  const preloadList: IPreloadStream[] = [];

  for (const item of list) {
    if (!item.videoModel?.PlayInfoList?.length) continue;

    const target = selectDef(item.videoModel.PlayInfoList);
    if (!target) continue;

    preloadList.push({
      url: target.MainPlayUrl,
      bitrate: target.Bitrate,
      duration: target.Duration,
      size: target.Size,
      definition: target.Definition,
      streamType: target.Format,
      codec: target.Codec,
      vid: item.vid,
    });
  }

  return preloadList;
};
