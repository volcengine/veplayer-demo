import VePlayer, { Events } from '@byted/veplayer';
// @ts-expect-error: 待添加type描述
import mp4Encrypt from '@byted/veplayer/plugin/mp4Encrypt.js';
import type { PlayerCore, IPlayerConfig } from '@byted/veplayer';

export { VePlayer as default, Events, PlayerCore, IPlayerConfig, mp4Encrypt };
