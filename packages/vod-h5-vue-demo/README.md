# 点播 Vue H5 Demo

## 简介

这是一个使用Vue 3和TypeScript构建的视频点播 H5 场景播放示例项目，用于展示火山引擎点播播放器SDK VePlayer的使用。

## 功能特性

- 基于Vue 3、TypeScript和Vite构建
- 集成火山引擎视频点播SDK
- 响应式设计，适配各种移动设备
- 短剧广场和剧场功能展示

## 目录结构

```
src/
├── api/             # API接口定义
├── assets/          # 静态资源文件
│   ├── img/         # 图片资源
│   └── svg/         # SVG图标
├── components/      # 通用组件
├── hooks/           # 自定义钩子
├── interface/       # 接口定义
├── pages/           # 页面组件
│   ├── home/        # 首页
│   ├── square/      # 短剧广场
│   └── theater/     # 短剧剧场
├── stores/          # Pinia状态管理
├── typings/         # 类型定义
└── utils/           # 工具函数
```

## 安装和使用

### 安装依赖

```bash
npm install
```
或
```bash
pnpm install
```

### 开发环境运行

```bash
npm run dev
```
或
```bash
pnpm dev
```

### 构建生产版本

```bash
npm run build
```
或
```bash
pnpm build
```

## 注意事项

- 开发前请先在Vite配置中设置正确的`__AuthorId__`
- 项目使用了HTTPS，首次运行需要信任自签名证书

## 许可证

MIT 