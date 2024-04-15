#!/bin/bash
rm -rf node_modules output
source ~/.nvm/nvm.sh
nvm install 18
nvm use 18
npm install -g pnpm
pnpm config set registry https://bnpm.byted.org/
cd packages/vod-h5-demo
pnpm install
pnpm build

# yarn deploy


