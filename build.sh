#!/bin/bash

set -e
rm -rf packages/vod-h5-demo/output
source ~/.nvm/nvm.sh
nvm install v18.16.0
nvm use v18.16.0

node -v
npm -v
npm i -g pnpm@7.16
pnpm -v
pnpm i --frozen-lockfile
cd packages/vod-h5-demo
pnpm i
pnpm build
