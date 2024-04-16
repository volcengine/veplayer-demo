#!/bin/bash

set -e
rm -rf node_modules
rm -rf packages/vod-h5-demo/output
rm -rf packages/vod-h5-demo/node_modules
source ~/.nvm/nvm.sh
nvm install v18.16.0
nvm use v18.16.0

node -v
npm -v
npm i -g pnpm@7.16
pnpm -v
pnpm install
cd packages/vod-h5-demo
pnpm build

mkdir output
