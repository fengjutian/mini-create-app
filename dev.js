#!/usr/bin/env node
// 简单的开发入口文件，用于加载TypeScript文件
import('ts-node/esm').then(() => {
  import('./src/main.ts');
}).catch(err => {
  console.error('Failed to load TypeScript file:', err);
  process.exit(1);
});