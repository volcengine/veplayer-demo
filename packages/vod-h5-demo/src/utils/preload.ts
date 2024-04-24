import { IPlayInfoListItem, IVideoDataWithModel } from '@/typings';
import { IPreloadData } from '@byted/xgplayer-vod-preload/es/index.interface';
import { selectDef } from '@/utils/index.ts';

const getPreloadData = (
  list: Array<IPlayInfoListItem & { vid?: string; vodecType?: string; vtype?: string }>,
): Array<IPreloadData> | undefined | null => {
  return list
    ?.filter(item => item?.vid)
    .map((cur, index) => {
      return {
        order: index,
        data: {
          vid: cur.vid as string,
          codecType: cur?.vodecType ?? 'h264',
          definition: cur.Definition,
          mediaType: '',
          payload: cur
            ? [
                {
                  url: [{ src: cur.MainPlayUrl }],
                  bitrate: cur.Bitrate,
                  duration: cur.Duration,
                  size: cur.Size,
                  codec: cur.Codec,
                  definition: cur.Definition,
                },
              ]
            : [],
          vtype: cur?.vtype ?? 'MP4',
          bizType: 0,
        },
      };
    });
};

const getDefInfo = (list: IVideoDataWithModel[], index: number) => {
  return selectDef(list?.[index]?.videoModel?.PlayInfoList ?? [], '720p');
};

const addPreloadList = (list: any, index: number) => {
  const laterDef = list?.[index + 1] ? getDefInfo(list, index + 1) : undefined;
  const preDef = list?.[index - 1] ? getDefInfo(list, index - 1) : undefined;
  const preloadList = [];
  laterDef &&
    preloadList.push({
      ...laterDef,
      vid: list[index + 1]?.vid,
    });
  preDef &&
    preloadList.push({
      ...preDef,
      vid: list[index - 1]?.vid,
    });
  window.preloader?.addPreloadList(getPreloadData(preloadList) as Array<IPreloadData>);
};

export { getPreloadData, addPreloadList };
