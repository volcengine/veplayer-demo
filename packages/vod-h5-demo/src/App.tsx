import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import { featRoutes } from './page.tsx';
import { PreloaderManager } from '@byted/xgplayer-vod-preload';
import Mp4EncryptPlayer, { Mp4Preloader } from '@byted/xgplayer-encrypt-mp4';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    ...featRoutes,
  ],
  { basename: __BASE__PATH__ },
);

function App() {
  useEffect(() => {
    PreloaderManager.debugger = true;
    const preloaderInst = new PreloaderManager();
    preloaderInst.register({
      config: {
        preloadCacheType: 1, // Memory方式
        autoPreload: true, // 适用脱离播放场景的自驱动预加载
        autoCheckPreload: false, // 需要与播放实例绑定
        autoCheck: {
          enable: true,
          interval: 1000,
        },
        preloadTime: 5,
        isDegrade: false,
        waitingTimeOut: 5000,
        needAutoBitrate: true,
        startPreloadMinBuffer: 5,
        startPreloadControl: true,
        maxBufferLength: 60,
        minBufferLength: 15,
        removeBufferLen: 60,
        preloadMaxCacheCount: 10,
        startPreloadMinPosTime: 0,
        resumePlayWaterLevel: 2,
        onProcessMinLen: 0,
        needPreloadCheck: false,
        forceVideoPlay: false,
        segmentMinDuration: 5,
        timerInWorker: false,
        tickInSeconds: 0.2,
        fixEditListOffset: false,
        audioGroupingStrategy: 1,
        adaptRange: {
          cacheSafeFactor: 3,
          estPTcontrol: true,
          estPlayTime: 12,
          maxTargetCacheDur: 30,
          minBandwidth: 1000000,
          minDangerThreshold: 4,
          minTargetCacheDur: 20,
          rangeControl: true,
          rangeMaxDuration: 15,
          rangeMinDuration: 5,
          rangeMinSize: 409600,
          safeFactor: 0.1,
          targetCacheControl: true,
        },
        noPreloadAddBufferLen: 0,
        loadRangeType: 'gop',
      },
      // @ts-expect-error: expect
      loaders: [Mp4Preloader],
    });
    Mp4EncryptPlayer.registerPreloader(preloaderInst);
    preloaderInst.enable();
    window.preloader = preloaderInst;
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
