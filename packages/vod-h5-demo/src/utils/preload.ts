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

import { IVideoDataWithModel } from '@/typings';
import { selectDef } from './index';

export const formatPreloadStreamList = (list: Array<IVideoDataWithModel>): any => {
  return list
    ?.map(item => {
      const target = selectDef(item.videoModel?.PlayInfoList ?? []);
      if (!target) {
        return undefined;
      }
      return {
        url: target.MainPlayUrl,
        bitrate: target.Bitrate,
        duration: target.Duration,
        size: target.Size,
        definition: target.Definition,
        streamType: target?.Format,
        codec: target?.Codec,
        vid: item.vid,
      };
    })
    .filter(i => i?.vid);
};
