import VePlayer from '@/player';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    flexible: any;
    playerSdk: VePlayer;
    preloader: any;
  }
}
