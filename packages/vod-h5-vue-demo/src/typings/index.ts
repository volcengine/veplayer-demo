/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

/**
 * 剧集信息接口
 */
export interface IDramaInfo {
  dramaId: string;
  dramaTitle: string;
  coverUrl: string;
  totalEpisodeNumber: number;
  latestEpisodeNumber: number;
  authorId: string;
}

/**
 * 视频模型接口
 */
export interface IVideoModel {
  PlayInfoList: Array<{
    MainPlayUrl: string;
    BackupPlayUrl?: string;
    Bitrate: number;
    Definition: string;
    Duration: number;
    Format: string;
    Codec: string;
    Size: number;
  }>;
  PosterUrl: string;
  Duration: number;
}

/**
 * 包含视频模型的数据接口
 */
export interface IVideoDataWithModel extends IVideoInfo {
  videoModel?: IVideoModel;
  vid: string;
  episodeDetail?: {
    episodeDesc: string;
    episodeNumber: number;
    dramaInfo: {
      dramaId: string;
      dramaTitle: string;
      totalEpisodeNumber: number;
    };
  };
}

export interface IVideoData {
  vid: string;
  coverUrl?: string;
  videoModel?: string;
  episodeDetail?: IEpisodeDetail;
  [key: string]: any;
}

export interface IVideoDataWithToken extends IVideoData {
  playAuthToken: string;
}

// 播放信息清单项接口
export interface IPlayInfoListItem {
  Bitrate: number;
  Definition: string;
  Format: string;
  Codec: string;
  MainPlayUrl: string;
  BackupPlayUrl?: string;
  Duration: number;
  Size: number;
}

// 推荐数据接口
export interface IRecommendData {
  result: IVideoDataWithModel[];
  total: number;
}

// 请求响应接口
export interface IResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface IEpisodeDetail {
  episodeDesc?: string;
  episodeNumber?: number;
  dramaInfo?: {
    dramaId?: string;
    dramaTitle?: string;
    totalEpisodeNumber?: number;
  };
}

// 视频信息模型
export interface IVideoInfo {
  id: string;
  coverUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  duration: number;
  vid?: string;
}

// 剧集详情
export interface IDramaDetail {
  dramaId: string;
  dramaInfo: IDramaInfo;
  episodeList: IVideoDataWithModel[];
}

// 预加载流信息
export interface IPreloadStream {
  url: string;
  bitrate: number;
  duration?: number;
  size?: number;
  definition?: string;
  streamType?: string;
  codec?: string;
  vid: string;
}

// 播放器配置 - 与VePlayer接口保持一致
export interface IPlayerOptions {
  id: string;
  playList: {
    url: string;
    definition: string;
    codecType: string;
    bitrate: number;
    vtype: string;
  }[];
  vid: string;
  startTime?: number;
  autoplay: boolean;
  enableDegradeMuteAutoplay: boolean;
  closeVideoClick: boolean;
  closeVideoDblclick: boolean;
  videoFillMode: string;
  codec: string;
  enableMp4MSE: boolean;
  ignores: string[];
  commonStyle: {
    playedColor: string;
  };
  controls: {
    mode: string;
  };
  mobile: {
    gradient: string;
    darkness: boolean;
    disableGesture: boolean;
    isTouchingSeek: boolean;
    gestureY: boolean;
  };
  adaptRange: {
    enable: boolean;
    minCacheDuration: number;
    maxCacheDuration: number;
  };
  progress: {
    onMoveStart: () => void;
    onMoveEnd: () => void;
  };
  sdkErrorPlugin: {
    isNeedRefreshButton: boolean;
  };
  start: {
    disableAnimate: boolean;
    isShowPause: boolean;
  };
  poster: {
    poster: string;
    hideCanplay: boolean;
    fillMode: 'fixWidth' | 'fixHeight' | 'cover' | 'contain';
  };
  vodLogOpts: {
    vtype: string;
    tag: string;
    codec_type: string;
    line_app_id: number;
  };
}

// 新增IPlayerConfig类型别名，确保与VePlayer一致
export type IPlayerConfig = IPlayerOptions;
