import Axios from 'axios';
import { configure } from 'axios-hooks';

const axios = Axios.create({
  baseURL: __API_BASE_URL__,
});

configure({ axios });

export const API_PATH = {
  GetEpisodeFeedStreamWithPlayAuthToken: '/api/drama/episode/v1/getEpisodeFeedStreamWithPlayAuthToken',
  ListDrama: '/api/drama/v1/listDrama',
  GetDramaEpisodeWithPlayAuthToken: '/api/drama/episode/v1/getDramaEpisodeWithPlayAuthToken',
  GetEpisodeFeedStreamWithVideoModel: '/api/drama/episode/v1/getEpisodeFeedStreamWithVideoModel',
  GetDramaEpisodeWithVideoModel: '/api/drama/episode/v1/getDramaEpisodeWithVideoModel',
};
