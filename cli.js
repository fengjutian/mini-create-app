#!/usr/bin/env node

// CLI 入口文件，用于全局安装后直接从命令行运行
import('./dist/src/main.js').catch(err => {
  console.error('Failed to load the application:', err);
  process.exit(1);
});