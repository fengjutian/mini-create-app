import fs from "fs";
import path from "path";

export function generateViteVue(projectPath: string) {
  fs.mkdirSync(path.join(projectPath, "src/components"), { recursive: true });
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(
      {
        name: "vite-vue-app",
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
          typecheck: "vue-tsc --noEmit" // 添加类型检查脚本
        },
        dependencies: { vue: "^3.2.0" },
        devDependencies: {
          vite: "^4.0.0",
          typescript: "^5.0.0",
          "@vitejs/plugin-vue": "^4.0.0",
          "vue-tsc": "^1.0.0"
        },
      },
      null,
      2
    )
  );
  
  // tsconfig.json
  fs.writeFileSync(
    path.join(projectPath, "tsconfig.json"),
    JSON.stringify({
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "preserve",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
      "references": [{ "path": "./tsconfig.node.json" }]
    }, null, 2)
  );

  // tsconfig.node.json
  fs.writeFileSync(
    path.join(projectPath, "tsconfig.node.json"),
    JSON.stringify({
      "compilerOptions": {
        "composite": true,
        "skipLibCheck": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowSyntheticDefaultImports": true
      },
      "include": ["vite.config.ts"]
    }, null, 2)
  );

  fs.writeFileSync(
    path.join(projectPath, "index.html"),
    `<!DOCTYPE html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`
  );
  fs.writeFileSync(
    path.join(projectPath, "vite.config.ts"),
    `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({ plugins: [vue()] });`
  );
  fs.writeFileSync(
    path.join(projectPath, "src/main.ts"),
    `import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');`
  );
  fs.writeFileSync(
    path.join(projectPath, "src/App.vue"),
    `<template><h1>Vue + Vite + TS</h1><HelloWorld msg="Hello Vue!"/></template><script setup lang="ts">import HelloWorld from './components/HelloWorld.vue'</script>`
  );
  fs.writeFileSync(
    path.join(projectPath, "src/components/HelloWorld.vue"),
    `<template><p>{{ msg }}</p></template><script setup lang="ts">defineProps<{ msg: string }>();</script>`
  );
}