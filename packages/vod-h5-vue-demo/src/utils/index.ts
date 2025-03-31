/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import type { IPlayInfoListItem, IVideoModel } from '@/typings';
export * from './preload';

// 获取操作系统和浏览器信息
export function getOS() {
  const ua = navigator.userAgent;
  const isWindowsPhone = /(?:Windows Phone)/.test(ua);
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
  const isAndroid = /Android/.test(ua);
  const isPhone = /(?:iPhone|iPod|iPad)/.test(ua);
  const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua));
  const isFireFox = /(?:Firefox)/.test(ua);
  const isWeixin = /MicroMessenger/.test(ua);
  const isLark = /Lark/.test(ua);
  return {
    isSymbian,
    isTablet,
    isPhone,
    isIOS,
    isWindowsPhone,
    isAndroid,
    isPc: !isAndroid && !isIOS && !isSymbian && !isTablet,
    isMobile: isPhone || isAndroid || isSymbian || isTablet,
    isFireFox,
    isWeixin,
    isLark,
  };
}

export const os = getOS();

/**
 * 判断页面是否有滚动条
 */
export function hasScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * 解析视频模型数据
 */
export function parseModel(videoModel: string): undefined | IVideoModel {
  try {
    return JSON.parse(videoModel);
  } catch (err) {
    console.warn('parse videoModel error: ', err);
    return undefined;
  }
}

/**
 * 格式化预加载流列表
 * @param list 视频列表
 */
export const formatPreloadStreamList = (list: any[]): any[] => {
  if (!list || !list.length) return [];
  return list
    .map(item => {
      if (!item.videoModel?.PlayInfoList?.length) return null;
      const playInfo = item.videoModel.PlayInfoList[0];
      return {
        mainPlayUrl: playInfo.MainPlayUrl,
        backupPlayUrl: playInfo.BackupPlayUrl,
      };
    })
    .filter(Boolean);
};

// 判断是否WIFI环境
export function isWifi() {
  try {
    const ua = window.navigator.userAgent;
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
        return true
      }
    }
    return true;
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
    return undefined;
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

// 是否支持预加载（仅PC和Android支持）
export const canSupportPreload = os.isPc || os.isAndroid;
