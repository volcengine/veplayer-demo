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
