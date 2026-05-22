# Apollo 编辑器

> 桌面视频与音频编辑器 — React 19 + TypeScript + Vite + Electron

---

## 目录

- [概述](#概述)
- [技术栈](#技术栈)
- [安装](#安装)
- [界面](#界面)
- [素材面板](#素材面板)
- [预览窗口](#预览窗口)
- [时间线](#时间线)
- [轨道](#轨道)
- [片段](#片段)
- [快捷键](#快捷键)
- [架构](#架构)

---

## 概述

Apollo 是一款桌面非线性媒体编辑器。您可以导入视频、音频和图片文件，将它们排列在多轨时间线上，并实时预览结果——一切均通过 Electron 在本地原生运行。

<!-- 截图：完整应用窗口——左侧素材面板，右侧预览窗口 -->
> 📸 _截图：应用主窗口_

---

## 技术栈

| 层次 | 库 / 工具 |
|---|---|
| UI | React 19 + TypeScript |
| 打包工具 | Vite 8 |
| 桌面外壳 | Electron 41 |
| 文件导入 | react-dropzone |
| 图标 | react-icons |
| 样式 | SCSS |

---

## 安装

需要 **Node.js 18+**。

```bash
# 克隆仓库
git clone https://github.com/your-org/apollo.git
cd apollo

# 安装依赖
npm install

# 以浏览器模式启动（仅 Vite 开发服务器）
npm run dev

# 以 Electron 桌面应用启动
npm run start

# 生产环境构建
npm run build
```

> `npm run start` 通过 `concurrently` 同时运行 Vite 和 Electron。Electron 会自动连接到 `http://localhost:5173`。

<!-- 截图：npm run start 后的终端输出 -->
> 📸 _截图：显示 Vite + Electron 启动的终端_

---

## 界面

界面分为上下两个主要区域：

```
┌─────────────────────────────────────────┐
│  素材面板              │  预览窗口       │
│  (ViewPortAssets)      │  (Preview)     │
├─────────────────────────────────────────┤
│             时间线 (TimeLine)            │
│  [侧边栏] [轨道 + 片段 + 播放头]         │
└─────────────────────────────────────────┘
```

| 区域 | 组件 | 说明 |
|---|---|---|
| 素材面板 | `ViewPortAssets` | 浏览、搜索和筛选已导入的媒体文件 |
| 预览窗口 | `Preview_Window` | 渲染播放头位置的当前帧 |
| 时间线 | `TimeLine` | 多轨片段编辑器 |
| 轨道侧边栏 | `TrackSidebar` | 轨道名称和删除按钮 |

<!-- 截图：带编号标注的界面示意图 -->
> 📸 _截图：标注各面板的界面布局_

---

## 素材面板

素材面板是项目的媒体库。

### 导入文件

将文件直接拖入放置区域，或点击文件按钮（`AddAssets`）打开文件选择器。  
支持类型：`image/*`、`video/*`、`audio/*`。

<!-- 截图：已加载文件的素材面板和搜索栏 -->
> 📸 _截图：已填充的素材面板_

### 搜索与筛选

素材加载后，筛选栏自动显示：
- **搜索输入框** — 按名称或素材 ID 筛选（防抖 500 ms）
- **类型下拉菜单** — 全部 / 视频 / 音频 / 图片

### 重命名素材

双击素材名称 → 就地编辑 → `Enter` 或 ✔ 保存，`Esc` 或 ✖ 取消。

### 拖拽到时间线

抓取任意素材并放置到时间线上的轨道，将在放置位置创建片段。

---

## 预览窗口

预览区域在 `currentTime` 处合成所有活动图层并进行渲染。

- 媒体同步：`useMediaSync` 钩子监听 `CurrentTimeContext` 中的 `currentTime`，并相应定位所有媒体元素。
- 图层由 `Preview` 内部的 `Layers` 组件管理。

<!-- 截图：视频播放时的预览画布 -->
> 📸 _截图：播放时的预览窗口_

### 播放控制

通过 `Options` 工具栏切换播放/暂停，或在时间线获得焦点时按 `空格键`。

---

## 时间线

时间线是主要的编辑区域。

<!-- 截图：包含多条轨道和片段的时间线 -->
> 📸 _截图：多轨道时间线，含视频、音频和图片片段_

### 时间标尺

点击标尺（`TimeRuler`）上的任意位置，播放头将跳转到该位置，预览立即更新。

### 缩放

在时间线获得焦点时滚动鼠标滚轮可缩放视图。  
`useZoomEffect` 钩子控制 `scale`（每秒像素数）和 `STEP`（标尺刻度间隔）。

### 添加轨道

点击侧边栏标题中的 **+ add Tracks** 按钮添加新的空轨道。

---

## 轨道

轨道是存放片段的水平通道。Apollo 默认创建 **6 条轨道**。

每条轨道包含：`id`、`name`、`clips[]`。

### 媒体类型颜色编码

| 类型 | 颜色 | 十六进制 |
|---|---|---|
| 视频 | 蓝灰色 | `#5E7A8C` |
| 音频 | 暖棕色 | `#8C6D5E` |
| 图片 | 橄榄绿 | `#718E5E` |
| 文字 | 深棕色 | `#4F3626` |

### 管理轨道

| 操作 | 方法 |
|---|---|
| 重命名 | 双击轨道名称 → `Enter` 保存，`Esc` 取消 |
| 删除 | 点击轨道名称旁的 **−** 按钮 |
| 添加 | 点击 **+ add Tracks** 按钮 |

---

## 片段

片段（`ClipItem`）是放置在时间线上的媒体块。

**片段属性：** `id`、`assetId`、`start`（秒）、`duration`（秒）、`type`、`sourceOffset`。

<!-- 截图：选中片段，蓝色边框和调整手柄可见 -->
> 📸 _截图：选中的片段及调整手柄_

### 操作

| 操作 | 方法 |
|---|---|
| 选中 | 点击片段块（出现蓝色 `#4FC3F7` 边框） |
| 移动 | 先选中，再拖拽到新位置（同一轨道或不同轨道） |
| 调整大小 | 拖动左侧或右侧手柄裁剪入点/出点 |
| 重命名 | 点击片段块上的编辑图标 |
| 音频淡化 | 拖动音频片段上的淡化手柄（`FadeClip`） |

> 移动使用 `useDragClip`，调整大小使用 `useResizeClip`。

---

## 快捷键

| 操作 | 快捷键 |
|---|---|
| 播放 / 暂停 | `空格` |
| 确认重命名 | `Enter` |
| 取消重命名 | `Esc` |
| 取消选中片段 | 点击时间线空白区域 |

---

## 架构

状态完全通过 React Context 管理——无需外部状态库。

```
main.tsx
└── ClipProvider          (ClipContext)
    └── CurrentTimeProvider  (CurrentTimeContext)
        └── PreviewProvider  (PreviewContext)
            └── App
                ├── VIewPort
                │   ├── ViewPortAssets
                │   └── Preview_Window → Preview
                └── TimeLine
                    ├── Options
                    ├── TrackSidebar[]
                    ├── TimeRuler
                    ├── Tracks → TrackRow → ClipItem[]
                    └── Playhead
```

### Context 说明

| Context | 职责 |
|---|---|
| `ClipContext` | 素材、时间线片段、轨道、选中片段的 ID |
| `CurrentTimeContext` | 播放头位置（`currentTime`，单位：秒） |
| `PreviewContext` | 播放状态（`isPlay`）、`handlePlay`、`handlePause` |

### Electron

`electron/main.ts` 创建 `BrowserWindow`（1200 × 800），在开发模式下加载 `http://localhost:5173`。
