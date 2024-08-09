import VePlayer, { Events } from '@volcengine/veplayer';
// @ts-expect-error: 待添加type描述
import mp4Encrypt from '@volcengine/veplayer/plugin/mp4Encrypt.js';
import type { PlayerCore, IPlayerConfig } from '@volcengine/veplayer';

export { VePlayer as default, Events, PlayerCore, IPlayerConfig, mp4Encrypt };
