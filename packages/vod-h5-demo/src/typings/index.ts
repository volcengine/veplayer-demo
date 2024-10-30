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

export interface IDramaInfo {
  dramaId: string;
  dramaTitle: string;
  description: string;
  coverUrl: string;
  totalEpisodeNumber: number;
  latestEpisodeNumber: number;
  authorId: string;
}

export interface IVideoData {
  vid: string;
  caption: string;
  duration: number;
  coverUrl: string;
  subtitleAuthToken: string;
  episodeDetail: {
    episodeNumber: number;
    episodeDesc: string;
    dramaInfo: IDramaInfo;
  };
}

export interface IVideoDataWithToken extends IVideoData {
  playAuthToken: string;
}

export interface IVideoDataWithModel extends IVideoData {
  videoModel: IVideoModel;
}

export interface IPlayInfoListItem {
  BackupPlayUrl: string;
  Bitrate: number;
  Codec: 'h264' | 'h265';
  Definition: string;
  Duration: number;
  FileId: string;
  FileType: string;
  Format: string;
  Height: number;
  MainPlayUrl: string;
  Quality: string;
  Size: number;
  Width: number;
}

export interface IVideoModel {
  Duration: number;
  FileType: string;
  Status: number;
  TotalCount: number;
  Version: number;
  Vid: string;
  PosterUrl: string;
  PlayInfoList: IPlayInfoListItem[];
}
