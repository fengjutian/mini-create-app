# Mini Create App

<div align="center">
  <img src="https://via.placeholder.com/200x200?text=Mini+Create+App" alt="Mini Create App Logo" width="200" />
  
  <h3>🚀 快速创建现代化前端项目的命令行工具</h3>
  
  <p>一站式配置多种框架、运行时、包管理器和功能库，提供直观的交互式选择体验</p>

  <p>
    <a href="#features">✨ 特性</a>
    •
    <a href="#quick-start">🚀 快速开始</a>
    •
    <a href="#usage">💡 使用指南</a>
    •
    <a href="#supported-technologies">🛠️ 支持的技术栈</a>
    •
    <a href="#project-structure">📁 项目结构</a>
  </p>
</div>

## ✨ 特性

- **框架支持**：React 和 Vue3 两种主流前端框架
- **多运行时环境**：支持 Node.js、Bun 和 Deno
- **灵活的包管理**：兼容 npm、pnpm、yarn 和 bun
- **增强的交互体验**：
  - 预设模板快速开始
  - 分步骤交互式配置
  - 配置选择总结确认
- **丰富的功能库选择**：
  - 数据验证库：zod、yup、io-ts 等
  - 异常处理库：neverthrow、ts-results 等
  - 测试框架：jest、vitest、cypress 等
  - 状态管理：Redux、Zustand、Pinia 等
  - UI 组件库：Material UI、Ant Design、Vuetify 等
- **开箱即用**：自动生成完整项目结构和配置
- **TypeScript 支持**：全项目使用 TypeScript 开发，提供完整类型定义

## 🚀 快速开始

### 前提条件

确保您的系统已安装以下软件：
- Node.js (v16.0.0 或更高版本) 或其他支持的运行时
- npm、pnpm、yarn 或 bun 中的任意一个包管理器

### 安装依赖

```bash
cd mini-create-app
npm install
```

### 构建项目

```bash
npm run build
```

### 运行应用

```bash
npm start
```

或者在开发模式下运行：

```bash
npm run dev
```

## 💡 使用指南

运行应用后，您将进入一个直观的交互式配置流程：

### 1. 选择创建方式

首先，您可以选择预设模板快速开始，或进行自定义配置：

- **✨ 快速开始 (React + Node + Vite)**：一键创建配置完善的 React 项目
- **✨ 快速开始 (Vue3 + Node + Vite)**：一键创建配置完善的 Vue3 项目
- **🛠️ 自定义配置**：完全自定义项目的各项配置

### 2. 自定义配置流程

如果选择了自定义配置，您将通过以下步骤完成配置：

#### 步骤 1: 选择核心配置

- **🎨 选择框架**：React 或 Vue3
- **⚙️ 选择运行环境**：Node.js、Bun 或 Deno
- **📦 选择包管理器**：npm、pnpm、yarn 或 bun

#### 步骤 2: 选择功能模块

根据需要选择以下功能模块（可选择 'none' 跳过）：

- **🔍 数据验证库**：如 zod、yup 等
- **🛡️ 异常处理库**：如 neverthrow、ts-results 等
- **🧪 测试框架**：如 jest、vitest、cypress 等
- **📊 全局状态管理库**：根据所选框架提供相应选项
- **🎨 UI 组件库**：根据所选框架提供相应选项

### 3. 确认配置

配置完成后，系统将显示配置总结，您可以确认或取消创建：

```
📋 项目配置总结

🎨 框架: react
⚙️ 运行环境: node
📦 包管理器: npm
🔍 验证库: zod
🛡️ 异常处理库: neverthrow
🧪 测试库: vitest
📊 状态管理库: zustand
🎨 UI库: none

确认使用以上配置创建项目吗? (Y/n)
```

### 4. 项目创建

确认配置后，系统将自动生成项目结构并安装依赖。创建完成后，按照提示进入项目目录并启动开发服务器：

```bash
cd [project-name]
[package-manager] install
[package-manager] run dev
```

## 🛠️ 支持的技术栈

### 框架
- **React**：现代化的前端UI库
- **Vue3**：渐进式JavaScript框架

### 运行时
- **Node.js**：基于Chrome V8引擎的JavaScript运行时
- **Bun**：高性能的JavaScript运行时和工具包
- **Deno**：安全的JavaScript和TypeScript运行时

### 包管理器
- **npm**：Node.js默认包管理器
- **pnpm**：高性能的包管理器
- **yarn**：快速、可靠、安全的依赖管理工具
- **bun**：内置的包管理器

### 数据验证库
- **zod**：TypeScript-first模式验证库
- **yup**：可组合的对象模式验证
- **io-ts**：TypeScript的运行时类型系统
- **superstruct**：简单而强大的JavaScript数据验证
- **valibot**：轻量级、类型安全的验证库
- **runtypes**：TypeScript运行时类型系统

### 异常处理库
- **neverthrow**：使用函数式编程处理错误
- **ts-results**：Rust风格的Result类型
- **oxide.ts**：受Rust启发的函数式编程工具
- **true-myth**：函数式编程的可选类型和结果类型
- **purify-ts**：函数式编程库
- **fp-ts**：函数式编程实用工具

### 测试框架
- **jest**：JavaScript测试框架
- **vitest**：Vite原生测试框架
- **cypress**：端到端测试框架
- **playwright**：跨浏览器测试框架
- **puppeteer**：无头浏览器自动化工具
- **react-testing-library**：React组件测试工具

### 状态管理库

**React**：
- Redux
- Zustand
- Recoil
- Jotai
- MobX
- Valtio
- Nanostores
- Redux Toolkit Query

**Vue3**：
- Pinia
- Valtio
- Nanostores
- MobX
- Redux Toolkit Query

### UI组件库

**React**：
- Material UI (MUI)
- Ant Design
- Chakra UI
- Blueprint
- Fluent UI
- Headless UI
- Radix UI
- Mantine
- NextUI

**Vue3**：
- Vuetify
- Naive UI
- Element Plus
- Ant Design Vue
- PrimeVue
- Vant
- Quasar
- TDesign Vue Next

## 📁 项目结构

```
mini-create-app/
├── .gitignore          # Git忽略配置
├── README.md           # 项目说明文档
├── dev.js              # 开发模式入口
├── package.json        # 项目配置和依赖
├── package-lock.json   # 依赖锁定文件
├── tsconfig.json       # TypeScript配置
└── src/                # 源代码目录
    ├── main.ts         # 主入口文件
    ├── types.ts        # TypeScript类型定义
    ├── generate_vite_react.ts  # React项目生成逻辑
    ├── generate_vite_vue.ts    # Vue项目生成逻辑
    └── generate_fresh.ts       # Deno Fresh项目生成逻辑
```

## 🚧 开发和构建

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 运行构建后的应用

```bash
npm start
```

## 🤝 贡献指南

我们欢迎任何形式的贡献！如果您有任何想法或建议，请按照以下步骤操作：

1. Fork 此仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目使用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 💬 联系我们

如有任何问题或建议，请随时提出 Issue 或提交 Pull Request。

---

Made with ❤️ by Mini Create App Team