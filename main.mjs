#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer from "inquirer";

// 可选框架与运行环境
const frameworks = ["react", "vue"];
const runtimes = ["node", "bun", "deno"];
const packageManagers = ["npm", "pnpm", "yarn", "bun"];

async function main() {
  const { framework, runtime, pkgManager } = await inquirer.prompt([
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

  const projectName = `${framework}-${runtime}-app`;
  fs.mkdirSync(projectName);

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

function generateViteReact(projectPath) {
  // create folders
  fs.mkdirSync(projectPath + "/src/components", { recursive: true });
  fs.mkdirSync(projectPath + "/src/routes", { recursive: true });
  fs.mkdirSync(projectPath + "/src/stores", { recursive: true });

  // package.json: include react-router-dom and zustand + eslint/prettier devDeps
  const pkg = {
    name: "vite-react-app",
    private: true,
    scripts: { dev: "vite", build: "vite build", preview: "vite preview", lint: "eslint src --ext .ts,.tsx" },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.9.0",
      zustand: "^4.1.0"
    },
    devDependencies: {
      vite: "^4.0.0",
      typescript: "^5.0.0",
      "@vitejs/plugin-react": "^3.0.0",
      eslint: "^8.40.0",
      "@typescript-eslint/parser": "^5.59.0",
      "@typescript-eslint/eslint-plugin": "^5.59.0",
      prettier: "^2.8.8",
      "eslint-config-prettier": "^8.8.0"
    }
  };
  fs.writeFileSync(projectPath + "/package.json", JSON.stringify(pkg, null, 2));

  // eslint config
  fs.writeFileSync(
    projectPath + "/.eslintrc.json",
    JSON.stringify({
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaVersion: 2020, sourceType: "module" },
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
      rules: {}
    }, null, 2)
  );

  // prettier config
  fs.writeFileSync(projectPath + "/.prettierrc", JSON.stringify({ semi: true, singleQuote: false }, null, 2));

  // index.html
  fs.writeFileSync(
    projectPath + "/index.html",
    `<!DOCTYPE html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`
  );

  // vite config
  fs.writeFileSync(
    projectPath + "/vite.config.ts",
    `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });`
  );

  // src/main.tsx — wrap with BrowserRouter
  fs.writeFileSync(
    projectPath + "/src/main.tsx",
    `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport { BrowserRouter } from 'react-router-dom';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <BrowserRouter>\n      <App />\n    </BrowserRouter>\n  </React.StrictMode>\n);`
  );

  // src/App.tsx — router + links
  fs.writeFileSync(
    projectPath + "/src/App.tsx",
    `import { Routes, Route, Link } from 'react-router-dom';\nimport Home from './routes/Home';\nimport About from './routes/About';\n\nexport default function App() {\n  return (\n    <div>\n      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>\n        <Link to=\"/\">Home</Link>\n        <Link to=\"/about\">About</Link>\n      </nav>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/about\" element={<About />} />\n      </Routes>\n    </div>\n  );\n}`
  );

  // src/routes/Home.tsx
  fs.writeFileSync(
    projectPath + "/src/routes/Home.tsx",
    `import Hello from '../components/Hello';\nimport { useCounter } from '../stores/useCounter';\n\nexport default function Home() {\n  const { count, increment } = useCounter();\n  return (\n    <div>\n      <h1>Home Page</h1>\n      <Hello />\n      <p>Counter: {count}</p>\n      <button onClick={increment}>+1</button>\n    </div>\n  );\n}`
  );

  // src/routes/About.tsx
  fs.writeFileSync(
    projectPath + "/src/routes/About.tsx",
    `export default function About() {\n  return (\n    <div>\n      <h1>About Page</h1>\n      <p>This is an example About page.</p>\n    </div>\n  );\n}`
  );

  // src/components/Hello.tsx
  fs.writeFileSync(
    projectPath + "/src/components/Hello.tsx",
    `export default function Hello(){ return <p>Hello Component</p>; }`
  );

  // src/stores/useCounter.ts — zustand store
  fs.writeFileSync(
    projectPath + "/src/stores/useCounter.ts",
    `import create from 'zustand';\n\ntype CounterState = { count: number; increment: () => void };\n\nexport const useCounter = create<CounterState>((set) => ({\n  count: 0,\n  increment: () => set((s) => ({ count: s.count + 1 })),\n}));`
  );
}


function generateViteVue(projectPath) {
  fs.mkdirSync(projectPath + "/src/components", { recursive: true });
  fs.writeFileSync(
    projectPath + "/package.json",
    JSON.stringify(
      {
        name: "vite-vue-app",
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: { vue: "^3.2.0" },
        devDependencies: { vite: "^4.0.0", typescript: "^5.0.0" },
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    projectPath + "/index.html",
    `<!DOCTYPE html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`
  );
  fs.writeFileSync(
    projectPath + "/vite.config.ts",
    `import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nexport default defineConfig({ plugins: [vue()] });`
  );
  fs.writeFileSync(
    projectPath + "/src/main.ts",
    `import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');`
  );
  fs.writeFileSync(
    projectPath + "/src/App.vue",
    `<template><h1>Vue + Vite + TS</h1><HelloWorld msg=\"Hello Vue!\"/></template><script setup lang=\"ts\">import HelloWorld from './components/HelloWorld.vue'</script>`
  );
  fs.writeFileSync(
    projectPath + "/src/components/HelloWorld.vue",
    `<template><p>{{ msg }}</p></template><script setup lang=\"ts\">defineProps<{ msg: string }>();</script>`
  );
}

function generateFresh(projectPath) {
  fs.mkdirSync(projectPath + "/routes", { recursive: true });
  fs.mkdirSync(projectPath + "/islands", { recursive: true });
  fs.mkdirSync(projectPath + "/components", { recursive: true });
  fs.writeFileSync(
    projectPath + "/deno.json",
    JSON.stringify(
      { tasks: { start: "deno run -A dev.ts" } },
      null,
      2
    )
  );
  fs.writeFileSync(projectPath + "/dev.ts", `import dev from \"$fresh/dev.ts\"; import config from \"./fresh.config.ts\"; await dev(import.meta.url, './main.ts', config);`);
  fs.writeFileSync(projectPath + "/main.ts", `import { start } from \"$fresh/server.ts\"; import manifest from \"./fresh.gen.ts\"; start(manifest);`);
  fs.writeFileSync(projectPath + "/fresh.config.ts", `export default {};`);
  fs.writeFileSync(projectPath + "/routes/index.tsx", `import Header from '../components/Header.tsx'; import Footer from '../components/Footer.tsx'; import Counter from '../islands/Counter.tsx'; export default function Home(){ return (<div><Header /><h1>Fresh + React</h1><Counter /><Footer /></div>); }`);
  fs.writeFileSync(projectPath + "/components/Header.tsx", `export default function Header(){ return <header><h2>Header</h2></header>; }`);
  fs.writeFileSync(projectPath + "/components/Footer.tsx", `export default function Footer(){ return <footer><p>Footer</p></footer>; }`);
  fs.writeFileSync(projectPath + "/islands/Counter.tsx", `import { useState } from 'preact/hooks'; export default function Counter(){ const [c,set]=useState(0); return <button onClick={()=>set(c+1)}>Count: {c}</button>; }`);
}

function generateVueCDN(projectPath) {
  fs.mkdirSync(projectPath + "/public", { recursive: true });
  fs.writeFileSync(
    projectPath + "/public/index.html",
    `<!DOCTYPE html><html><head><script src=\"https://unpkg.com/vue@3/dist/vue.global.js\"></script><script type=\"module\" src=\"./HelloWorld.js\"></script></head><body><div id=\"app\"></div><script>const { createApp } = Vue; createApp({ components: { HelloWorld } }).mount('#app');</script></body></html>`
  );
  fs.writeFileSync(
    projectPath + "/public/HelloWorld.js",
    `export const HelloWorld = { props: ['msg'], template: '<h1>{{ msg }}</h1>' };`
  );
  fs.writeFileSync(
    projectPath + "/deno.json",
    JSON.stringify(
      { tasks: { start: "deno run --allow-net --allow-read public/index.html" } },
      null,
      2
    )
  );
}

function generateReadme(projectPath, framework, runtime, pkgManager) {
  const cmds = {
    npm: { install: "npm install", dev: "npm run dev" },
    pnpm: { install: "pnpm install", dev: "pnpm dev" },
    yarn: { install: "yarn install", dev: "yarn dev" },
    bun: { install: "bun install", dev: "bun dev" },
  };

  const chosen = cmds[pkgManager];
  fs.writeFileSync(
    projectPath + "/README.md",
    `# ${framework} + ${runtime} Starter\n\n## 开发\n\n\n\`${chosen.install}\`\n\n然后运行:\n\n\`${chosen.dev}\``
  );
}

main();