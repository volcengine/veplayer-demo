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
  videoModel: IVideoModel
}

export interface IPlayInfoListItem {
  BackupPlayUrl: string;
  Bitrate: number;
  Codec: 'h264' | 'h265';
  Definition: string;
  Duration: number;
  FileId:string;
  FileType: string;
  Format:string;
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
