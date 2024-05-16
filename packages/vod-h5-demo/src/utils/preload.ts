import { IPlayInfoListItem, IVideoDataWithModel } from '@/typings';
import type { IPreloadData } from '@/player';
import { selectDef, os } from '@/utils/index.ts';
import VePlayer from '@/player';

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
          vtype: cur?.vtype ?? 'MP4',
          payload: cur
            ? [
                {
                  url: [{ src: cur.MainPlayUrl }],
                  bitrate: cur.Bitrate,
                  duration: cur.Duration,
                  size: cur.Size,
                  definition: cur.Definition,
                },
              ]
            : [],
        },
      };
    });
};

const getDefInfo = (list: IVideoDataWithModel[], index: number) => {
  return selectDef(list?.[index]?.videoModel?.PlayInfoList ?? [], '720p');
};

const addPreloadList = (list: any, index: number) => {
  if (!(os.isPc || os.isAndroid)) {
    return;
  }
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
  console.log('cus-> add preload list', getPreloadData(preloadList));
  VePlayer.preloader.addList(getPreloadData(preloadList) as Array<IPreloadData>);
};

export { getPreloadData, addPreloadList };
