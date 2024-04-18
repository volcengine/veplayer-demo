import VePlayer from '@volcengine/veplayer';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    flexible: any;
    playerSdk: VePlayer;
  }
}
