import { NavBar, Tabs, Grid } from 'antd-mobile';
// import useAxios from 'axios-hooks';
// import { API_PATH } from '../../api';
import { useNavigate } from 'react-router-dom';
import DramaCard from '../../components/drama_card';

import style from './index.module.less';

// import playData from '../../model';

const tabs = [
  {
    title: '剧场',
    key: 'square',
  },
  // {
  //   title: '推荐',
  //   key: 'recommend',
  // },
];

function Square() {
  // const [{ data, loading }, getVideos] = useAxios(
  //   {
  //     url: API_PATH.ListDrama,
  //     method: 'POST',
  //     data: {
  //       authorId: __AuthorId__,
  //       offset: 0,
  //       pageSize: 50,
  //     },
  //   },
  //   { manual: false },
  // );
  const data = [
    {
      dramaId: '3780',
      dramaTitle: '龙魂赘婿',
      description: '龙魂赘婿',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyODk0MTk0Nl/pvpnprYLotZjlqb9fY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3781',
      dramaTitle: '绝世神王',
      description: '绝世神王',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTAyMDg4NF/nu53kuJbnpZ7njotfY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3782',
      dramaTitle: '最强快递王',
      description: '最强快递王',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTA4NjY1Ml/mnIDlvLrlv6vpgJLnjotfY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3783',
      dramaTitle: '女总裁的神级保镖',
      description: '女总裁的神级保镖',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTE1MDgwNF/lpbPmgLvoo4HnmoTnpZ7nuqfkv53plZZfY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3784',
      dramaTitle: '都市玄门医婿',
      description: '都市玄门医婿',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTIwOTgzMV/pg73luILnjoTpl6jljLvlqb9fY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3785',
      dramaTitle: '重回90当土豪',
      description: '重回90当土豪',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTI3MTA4OF/ph43lm545MOW9k+Wcn+ixql9jb3Zlcg==~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3786',
      dramaTitle: '仙医下山',
      description: '仙医下山',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTM1MjMxOV/ku5nljLvkuIvlsbFfY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3787',
      dramaTitle: '极品武道医仙',
      description: '极品武道医仙',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTQwNjA3Ml/mnoHlk4HmrabpgZPljLvku5lfY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
    {
      dramaId: '3788',
      dramaTitle: '神豪败家子',
      description: '神豪败家子',
      coverUrl:
        'http://bytevod-drama-cover1.byte-test.com/tos-vod-boe-v-37f0e876b2846a20/vod/demo/drama/episode/image/MTcxMjcyOTQ0OTUzMF/npZ7osarotKXlrrblrZBfY292ZXI=~tplv-vod-obj.image',
      totalEpisodeNumber: 3,
      latestEpisodeNumber: 3,
      authorId: 'frank_drama_test_5',
    },
  ];

  const list = data.map(item => ({ ...item, poster: item.coverUrl }));

  const navigate = useNavigate();
  const back = () => navigate('/');
  return (
    <div className={style.main}>
      <NavBar className={style.head} onBack={back}>
        <Tabs>
          {tabs.map(item => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
        </Tabs>
      </NavBar>
      <Grid className={style.content} columns={3} gap={8}>
        {list.map(item => (
          <Grid.Item>
            <DramaCard
              dramaId={item.dramaId}
              dramaTitle={item.dramaTitle}
              coverUrl={item.coverUrl}
              totalEpisodeNumber={item.totalEpisodeNumber}
              latestEpisodeNumber={item.latestEpisodeNumber}
            />
          </Grid.Item>
        ))}
      </Grid>
    </div>
  );
}

export default Square;
