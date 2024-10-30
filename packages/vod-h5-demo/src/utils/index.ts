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

import { IPlayInfoListItem, IVideoModel } from '@/typings';
export * from './preload';

function getOS(): {
  isTablet?: boolean;
  isPhone?: boolean;
  isIpad?: boolean;
  isIos?: boolean;
  isAndroid?: boolean;
  isPc?: boolean;
  isMobile?: boolean;
  isFireFox?: boolean;
  isWeixin?: boolean;
  isLark?: boolean;
} {
  if (typeof navigator === 'undefined') {
    return {};
  }
  const ua = navigator.userAgent;
  const isAndroid = /(?:Android)/.test(ua);
  const isFireFox = /(?:Firefox)/.test(ua);
  const isIpad = /(?:iPad|PlayBook)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isTablet = isIpad || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua));
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet;
  const isPc = !isPhone && !isAndroid && !isTablet;
  const isWeixin = /(?:micromessenger)/.test(ua.toLocaleLowerCase());
  const isLark = /(?:lark)/.test(ua.toLocaleLowerCase());
  const isWindowsPhone = /(?:Windows Phone)/.test(ua);
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
  return {
    isTablet,
    isPhone,
    isIpad,
    isIos: isPhone || isIpad,
    isAndroid,
    isPc,
    isMobile: isPhone || isAndroid || isSymbian || isTablet,
    isFireFox,
    isWeixin,
    isLark,
  };
}

export const os = getOS();

export function parseModel(videoModel: string): undefined | IVideoModel {
  try {
    return JSON.parse(videoModel);
  } catch (err) {
    console.warn('parse videoModel error: ', err);
  }
}

export function isWifi() {
  try {
    let wifi = false;
    const ua = window.navigator.userAgent;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const con = window.navigator.connection;
    // 如果是微信
    if (os.isWeixin) {
      if (ua.indexOf('WIFI') >= 0) {
        return true;
      }
      // 如果支持navigator.connection
    } else if (con) {
      const network = con.type;
      if (network === 'wifi') {
        wifi = true;
      }
    }
    return wifi;
  } catch (e) {
    return false;
  }
}

/**
 * 根据环境选择清晰度
 * @param list 清晰度列表
 * @param defaultDef 弱网下的默认清晰度
 */
export function selectDef(list: IPlayInfoListItem[], defaultDef = '720p'): undefined | IPlayInfoListItem {
  if (!list.length) {
    return;
  }
  const orderList = list.sort((a, b) => a.Bitrate - b.Bitrate);
  const lowestDef = orderList[0];
  const highestDef = orderList[orderList.length - 1];
  if (os.isPc) {
    // pc使用最高码率
    return highestDef;
  } else {
    // 其他环境下，如h5
    if (isWifi()) {
      // wifi 下使用最高码率
      return highestDef;
    } else {
      const target = list.find(item => item.Definition === defaultDef);
      if (target) {
        return target;
      } else {
        return lowestDef;
      }
    }
  }
}

export function hasScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

export const canSupportPreload = os.isPc || os.isAndroid;