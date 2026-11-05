<div align="center">

# 🐾 Purr Task

### 把今天的小事，轻轻放进时间里。

一款温柔、轻巧的桌面任务记录应用。  
用一点点仪式感，记下正在做的事，也记住已经完成的自己。

</div>

---

## ✨ 关于 Purr Task

Purr Task 是一款基于 **Tauri 2 + Vue 3** 构建的桌面应用。它把任务记录、日历回顾和个性化外观放在一个简洁的界面里，让日常安排更清楚，也更有一点可爱的陪伴感。

## 🌱 你可以用它

| 功能 | 说明 |
| --- | --- |
| **记录今天** | 添加、完成或删除当天的任务，看看今日进度与统计 |
| **回顾上一周** | 按周一至周日整理记录，查看完成情况和活跃日期 |
| **浏览日历** | 按月份查看任务，快速翻阅不同日期的安排 |
| **管理垃圾桶** | 恢复误删记录，或确认后永久删除 |
| **搭配喜欢的主题** | 自选主题色、全局背景和进度条样式 |
| **保留你的偏好** | 外观设置保存在本机，下次打开仍是熟悉的样子 |

## 🧸 界面灵感

特别感谢 [animal-island-ui](https://github.com/guokaigdg/animal-island-ui) 提供的组件与界面设计灵感。它温暖、轻松的视觉表达，为 Purr Task 的一些 UI 设计带来了很好的启发。

## 🚀 开始使用

### 环境准备

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)
- Tauri 所需的平台开发依赖：请参考 [Tauri 2 前置条件](https://v2.tauri.app/start/prerequisites/)

### 安装依赖并启动

```bash
pnpm install
pnpm tauri dev
```

### 构建桌面应用

```bash
pnpm tauri build
```

仅构建并检查前端：

```bash
pnpm build
```

## 🤖 GitHub Actions 自动打包

推送代码、提交 Pull Request，或在 GitHub Actions 页面手动运行 **Build desktop packages**，会分别构建：

- `purr-task-windows-x64`：Windows x64 MSI 安装包
- `purr-task-kylin-v10-arm64-appimage`：Linux ARM64（aarch64）AppImage

构建完成后，可在对应 Actions 运行页面的 **Artifacts** 区域下载产物。Linux AppImage 由 Ubuntu 22.04 ARM64 runner 原生构建并检查其架构。AppImage 可绕过 `.deb` 安装时的包管理器依赖检查，但 Tauri 2 仍需要系统提供 WebKitGTK 4.1（`libwebkit2gtk-4.1-0`）等运行库；如果麒麟 V10 环境没有这些库，AppImage 也可能无法启动。请在目标设备上验证运行依赖。

## 🗂️ 项目结构

```text
.github/
└── workflows/
    └── build.yml     # Windows 与 Linux ARM64 自动打包

src/
├── components/     # 页面与通用 UI 组件
├── constants/      # 应用常量
├── layouts/        # 页面布局
├── repositories/   # 前端数据访问边界
├── router/         # 路由配置
├── stores/         # Pinia 状态管理
├── theme/          # 背景、颜色与进度条主题
├── types/          # TypeScript 类型声明
├── utils/          # 日期等通用工具
└── views/          # 今天、周回顾、日历、设置与垃圾桶

src-tauri/
└── src/
    ├── database.rs # SQLite 数据层
    └── lib.rs      # Tauri 命令与应用入口
```

## 🧱 技术栈

- **桌面应用**：Tauri 2、Rust
- **界面**：Vue 3、TypeScript、Vue Router
- **状态管理**：Pinia
- **组件与样式**：Naive UI、UnoCSS
- **本地数据**：SQLite、rusqlite

## 💾 数据与日期

任务数据保存在 Tauri 的本机应用数据目录中，通过 SQLite 持久化；前端经由 Repository 调用 Tauri 命令，不直接访问数据库。删除任务采用软删除，因此可以在垃圾桶中恢复；永久删除需要在界面确认。

日期边界按设备的**本地时区**计算。“今天”展示本地当天的记录；“最近 7 天”回顾上一个完整自然周（周一至周日）。主题颜色、背景与进度条样式保存在本机 `localStorage` 中。

## ✅ 验证

```bash
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

---

<div align="center">

用小小的记录，收集认真生活的每一天。 🐈

</div>
