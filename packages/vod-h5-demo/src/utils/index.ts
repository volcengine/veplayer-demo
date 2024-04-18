import { IVideoModel } from '../interface';

function getOS() {
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
  return {
    isTablet,
    isPhone,
    isIpad,
    isIos: isPhone || isIpad,
    isAndroid,
    isPc,
    isFireFox,
  };
}

export function parseModel(videoModel: string): void | IVideoModel {
  try {
    return JSON.parse(videoModel);
  } catch (err) {
    console.warn('parse videoModel error: ', err);
  }
}

export function getImageXURL(url: string) {
  // TODO getImageXURL 方法实现
  console.log(url);
}

export const os = getOS();

export function hasScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}
