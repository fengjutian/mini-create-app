#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer, { Answers } from "inquirer";
import { generateViteReact } from "./generate_vite_react.ts";

// 可选框架与运行环境
type Framework = "react" | "vue";
type Runtime = "node" | "bun" | "deno"
type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const frameworks: Framework[] = ["react", "vue"];
const runtimes: Runtime[] = ["node", "bun", "deno"];
const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

async function main() {
  const answers: Answers = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "选择框架:",
      choices: frameworks,
    },
    {
      type: "list",
      name: "runtime",
      message: "选择运行环境:",
      choices: runtimes,
    },
    {
      type: "list",
      name: "pkgManager",
      message: "选择包管理器:",
      choices: packageManagers,
    },
  ]);

  const framework = answers.framework as Framework;
  const runtime = answers.runtime as Runtime;
  const pkgManager = answers.pkgManager as PackageManager;

  const projectName = `${framework}-${runtime}-app`;
  fs.mkdirSync(projectName, { recursive: true });

  const projectPath = path.join(process.cwd(), projectName);
  
  // 根据选择生成不同模板
  if (runtime === "node" || runtime === "bun") {
    if (framework === "react") {
      generateViteReact(projectPath);
    } else {
      generateViteVue(projectPath);
    }
  } else if (runtime === "deno") {
    if (framework === "react") {
      generateFresh(projectPath);
    } else {
      generateVueCDN(projectPath);
    }
  }

  // 生成 README
  generateReadme(projectPath, framework, runtime, pkgManager);

  console.log(`\n项目已生成: ${projectName}`);
  console.log(`\n接下来运行:`);
  if (pkgManager === "npm") {
    console.log(`  cd ${projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  } else if (pkgManager === "pnpm") {
    console.log(`  cd ${projectName}`);
    console.log(`  pnpm install`);
    console.log(`  pnpm dev`);
  } else if (pkgManager === "yarn") {
    console.log(`  cd ${projectName}`);
    console.log(`  yarn install`);
    console.log(`  yarn dev`);
  } else if (pkgManager === "bun") {
    console.log(`  cd ${projectName}`);
    console.log(`  bun install`);
    console.log(`  bun dev`);
  }
}

// ---------- 模板生成 ----------

// function generateViteReact(projectPath: string) {
//   // create folders
//   fs.mkdirSync(path.join(projectPath, "src/components"), { recursive: true });
//   fs.mkdirSync(path.join(projectPath, "src/routes"), { recursive: true });
//   fs.mkdirSync(path.join(projectPath, "src/stores"), { recursive: true });

//   // package.json: include react-router-dom and zustand + eslint/prettier devDeps
//   const pkg = {
//     name: "vite-react-app",
//     private: true,
//     scripts: { 
//       dev: "vite", 
//       build: "vite build", 
//       preview: "vite preview", 
//       lint: "eslint src --ext .ts,.tsx",
//       typecheck: "tsc --noEmit" // 添加类型检查脚本
//     },
//     dependencies: {
//       react: "^18.2.0",
//       "react-dom": "^18.2.0",
//       "react-router-dom": "^6.9.0",
//       zustand: "^4.1.0"
//     },
//     devDependencies: {
//       vite: "^4.0.0",
//       typescript: "^5.0.0",
//       "@vitejs/plugin-react": "^3.0.0",
//       eslint: "^8.40.0",
//       "@typescript-eslint/parser": "^5.59.0",
//       "@typescript-eslint/eslint-plugin": "^5.59.0",
//       prettier: "^2.8.8",
//       "eslint-config-prettier": "^8.8.0",
//       "@types/react": "^18.2.0",
//       "@types/react-dom": "^18.2.0",
//       "@types/react-router-dom": "^5.3.3"
//     }
//   };
//   fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify(pkg, null, 2));

//   // eslint config
//   fs.writeFileSync(
//     path.join(projectPath, ".eslintrc.json"),
//     JSON.stringify({
//       parser: "@typescript-eslint/parser",
//       parserOptions: { ecmaVersion: 2020, sourceType: "module" },
//       plugins: ["@typescript-eslint"],
//       extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
//       rules: {}
//     }, null, 2)
//   );

//   // prettier config
//   fs.writeFileSync(
//     path.join(projectPath, ".prettierrc"), 
//     JSON.stringify({ semi: true, singleQuote: false }, null, 2)
//   );

//   // tsconfig.json
//   fs.writeFileSync(
//     path.join(projectPath, "tsconfig.json"),
//     JSON.stringify({
//       "compilerOptions": {
//         "target": "ES2022",
//         "useDefineForClassFields": true,
//         "lib": ["ES2022", "DOM", "DOM.Iterable"],
//         "module": "ESNext",
//         "skipLibCheck": true,
//         "moduleResolution": "bundler",
//         "allowImportingTsExtensions": true,
//         "resolveJsonModule": true,
//         "isolatedModules": true,
//         "noEmit": true,
//         "jsx": "react-jsx",
//         "strict": true,
//         "noUnusedLocals": true,
//         "noUnusedParameters": true,
//         "noFallthroughCasesInSwitch": true
//       },
//       "include": ["src"],
//       "references": [{ "path": "./tsconfig.node.json" }]
//     }, null, 2)
//   );

//   // tsconfig.node.json
//   fs.writeFileSync(
//     path.join(projectPath, "tsconfig.node.json"),
//     JSON.stringify({
//       "compilerOptions": {
//         "composite": true,
//         "skipLibCheck": true,
//         "module": "ESNext",
//         "moduleResolution": "bundler",
//         "allowSyntheticDefaultImports": true
//       },
//       "include": ["vite.config.ts"]
//     }, null, 2)
//   );

//   // index.html
//   fs.writeFileSync(
//     path.join(projectPath, "index.html"),
//     `<!DOCTYPE html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`
//   );

//   // vite config
//   fs.writeFileSync(
//     path.join(projectPath, "vite.config.ts"),
//     `import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// export default defineConfig({ plugins: [react()] });`
//   );

//   // src/main.tsx — wrap with BrowserRouter
//   fs.writeFileSync(
//     path.join(projectPath, "src/main.tsx"),
//     `import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );`
//   );

//   // src/App.tsx — router + links
//   fs.writeFileSync(
//     path.join(projectPath, "src/App.tsx"),
//     `import { Routes, Route, Link } from 'react-router-dom';
// import Home from './routes/Home';
// import About from './routes/About';

// export default function App() {
//   return (
//     <div>
//       <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
//         <Link to="/">Home</Link>
//         <Link to="/about">About</Link>
//       </nav>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//       </Routes>
//     </div>
//   );
// }`
//   );

//   // src/routes/Home.tsx
//   fs.writeFileSync(
//     path.join(projectPath, "src/routes/Home.tsx"),
//     `import Hello from '../components/Hello';
// import { useCounter } from '../stores/useCounter';

// export default function Home() {
//   const { count, increment } = useCounter();
//   return (
//     <div>
//       <h1>Home Page</h1>
//       <Hello />
//       <p>Counter: {count}</p>
//       <button onClick={increment}>+1</button>
//     </div>
//   );
// }`
//   );

//   // src/routes/About.tsx
//   fs.writeFileSync(
//     path.join(projectPath, "src/routes/About.tsx"),
//     `export default function About() {
//   return (
//     <div>
//       <h1>About Page</h1>
//       <p>This is an example About page.</p>
//     </div>
//   );
// }`
//   );

//   // src/components/Hello.tsx
//   fs.writeFileSync(
//     path.join(projectPath, "src/components/Hello.tsx"),
//     `export default function Hello(){ return <p>Hello Component</p>; }`
//   );

//   // src/stores/useCounter.ts — zustand store
//   fs.writeFileSync(
//     path.join(projectPath, "src/stores/useCounter.ts"),
//     `import { create } from 'zustand';

// type CounterState = { count: number; increment: () => void };

// export const useCounter = create<CounterState>((set) => ({
//   count: 0,
//   increment: () => set((s) => ({ count: s.count + 1 })),
// }));`
//   );
// }

function generateViteVue(projectPath: string) {
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

function generateFresh(projectPath: string) {
  fs.mkdirSync(path.join(projectPath, "routes"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "islands"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "components"), { recursive: true });
  fs.writeFileSync(
    path.join(projectPath, "deno.json"),
    JSON.stringify(
      { tasks: { start: "deno run -A dev.ts" } },
      null,
      2
    )
  );
  fs.writeFileSync(path.join(projectPath, "dev.ts"), `import dev from "$fresh/dev.ts"; import config from "./fresh.config.ts"; await dev(import.meta.url, './main.ts', config);`);
  fs.writeFileSync(path.join(projectPath, "main.ts"), `import { start } from "$fresh/server.ts"; import manifest from "./fresh.gen.ts"; start(manifest);`);
  fs.writeFileSync(path.join(projectPath, "fresh.config.ts"), `export default {};`);
  fs.writeFileSync(path.join(projectPath, "routes/index.tsx"), `import Header from '../components/Header.tsx'; import Footer from '../components/Footer.tsx'; import Counter from '../islands/Counter.tsx'; export default function Home(){ return (<div><Header /><h1>Fresh + React</h1><Counter /><Footer /></div>); }`);
  fs.writeFileSync(path.join(projectPath, "components/Header.tsx"), `export default function Header(){ return <header><h2>Header</h2></header>; }`);
  fs.writeFileSync(path.join(projectPath, "components/Footer.tsx"), `export default function Footer(){ return <footer><p>Footer</p></footer>; }`);
  fs.writeFileSync(path.join(projectPath, "islands/Counter.tsx"), `import { useState } from 'preact/hooks'; export default function Counter(){ const [c,set]=useState(0); return <button onClick={()=>set(c+1)}>Count: {c}</button>; }`);
}

function generateVueCDN(projectPath: string) {
  fs.mkdirSync(path.join(projectPath, "public"), { recursive: true });
  fs.writeFileSync(
    path.join(projectPath, "public/index.html"),
    `<!DOCTYPE html><html><head><script src="https://unpkg.com/vue@3/dist/vue.global.js"></script><script type="module" src="./HelloWorld.js"></script></head><body><div id="app"></div><script>const { createApp } = Vue; createApp({ components: { HelloWorld } }).mount('#app');</script></body></html>`
  );
  fs.writeFileSync(
    path.join(projectPath, "public/HelloWorld.js"),
    `export const HelloWorld = { props: ['msg'], template: '<h1>{{ msg }}</h1>' };`
  );
  fs.writeFileSync(
    path.join(projectPath, "deno.json"),
    JSON.stringify(
      { tasks: { start: "deno run --allow-net --allow-read public/index.html" } },
      null,
      2
    )
  );
}

function generateReadme(projectPath: string, framework: Framework, runtime: Runtime, pkgManager: PackageManager) {
  const cmds = {
    npm: { install: "npm install", dev: "npm run dev" },
    pnpm: { install: "pnpm install", dev: "pnpm dev" },
    yarn: { install: "yarn install", dev: "yarn dev" },
    bun: { install: "bun install", dev: "bun dev" },
  };

  const chosen = cmds[pkgManager];
  fs.writeFileSync(
    path.join(projectPath, "README.md"),
    `# ${framework} + ${runtime} Starter\n\n## 开发\n\n\n\`${chosen.install}\`\n\n然后运行:\n\n\`${chosen.dev}\``
  );
}

// 添加TypeScript专用模板生成函数
function generateTypeScriptProject(projectPath: string) {
  // 创建基本项目结构
  fs.mkdirSync(path.join(projectPath, "src"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "src/utils"), { recursive: true });
  
  // package.json
  const pkg = {
    name: "typescript-starter",
    private: true,
    scripts: {
      dev: "ts-node src/index.ts",
      build: "tsc",
      start: "node dist/index.js",
      typecheck: "tsc --noEmit"
    },
    dependencies: {},
    devDependencies: {
      typescript: "^5.0.0",
      "@types/node": "^20.0.0",
      "ts-node": "^10.9.0"
    }
  };
  fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify(pkg, null, 2));
  
  // tsconfig.json
  fs.writeFileSync(
    path.join(projectPath, "tsconfig.json"),
    JSON.stringify({
      "compilerOptions": {
        "target": "ES2022",
        "module": "CommonJS",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules"]
    }, null, 2)
  );
  
  // .gitignore
  fs.writeFileSync(
    path.join(projectPath, ".gitignore"),
    `node_modules\ndist\n*.log\n.env\n.vscode\n.idea\n*.swp\n*.swo\n*~`
  );
  
  // src/index.ts
  fs.writeFileSync(
    path.join(projectPath, "src/index.ts"),
    `import { greet } from './utils/greeting';\n\nconsole.log('Hello TypeScript!');\nconsole.log(greet('Developer'));`
  );
  
  // src/utils/greeting.ts
  fs.writeFileSync(
    path.join(projectPath, "src/utils/greeting.ts"),
    `export function greet(name: string): string {\n  return \`Welcome, ${name}! This is your TypeScript project.\`;\n}`
  );
}

main();