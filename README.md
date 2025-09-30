# MiniAppCreator

一个快速创建小型前端应用的命令行工具，支持多种框架、运行时和包管理器。

## 功能特性

- 🏗️ 快速创建 React 或 Vue 项目
- 🛠️ 支持多种运行时环境：Node.js、Bun、Deno
- 📦 支持多种包管理器：npm、pnpm、yarn、bun
- 🚀 开箱即用的项目配置
- 📝 使用 TypeScript 开发

## 快速开始

### 前提条件

确保您的系统已安装以下软件：
- Node.js (v16.0.0 或更高版本) 或其他支持的运行时
- npm、pnpm、yarn 或 bun 中的任意一个包管理器

### 安装依赖

```bash
cd mini-create-app
npm install
```

### 启动应用

```bash
npm run dev
```

## 如何使用

1. 运行应用后，会出现交互式菜单
2. 选择您想要创建的框架（React 或 Vue）
3. 选择您想要使用的运行时环境（Node、Bun 或 Deno）
4. 选择您想要使用的包管理器（npm、pnpm、yarn 或 bun）
5. 工具将自动创建相应的项目结构

## 支持的技术栈

### 框架
- React
- Vue

### 运行时
- Node.js
- Bun
- Deno

### 包管理器
- npm
- pnpm
- yarn
- bun

## 开发和构建

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

## 项目结构

```
mini-create-app/
├── .gitignore          # Git 忽略文件
├── README.md           # 项目说明文档
├── main.ts             # 主入口文件
├── package.json        # 项目配置和依赖
├── package-lock.json   # 依赖锁定文件
├── tsconfig.json       # TypeScript 配置
└── src/                # 源代码目录
```

## 贡献指南

1. Fork 此仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目使用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件