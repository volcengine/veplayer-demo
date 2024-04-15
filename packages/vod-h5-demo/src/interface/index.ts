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
  playAuthToken: string;
  subtitleAuthToken: string;
  episodeDetail: {
    episodeNumber: number;
    episodeDesc: string;
    dramaInfo: IDramaInfo;
  };
}
