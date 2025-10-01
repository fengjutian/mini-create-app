#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer, { Answers } from "inquirer";
import { generateViteReact } from "./generate_vite_react.ts";
import { generateViteVue } from "./generate_vite_vue.ts";
import { generateFresh } from './generate_fresh.ts'
import { generateVueCDN } from "./generate_vue_CDN.ts";

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

// function generateVueCDN(projectPath: string) {
//   fs.mkdirSync(path.join(projectPath, "public"), { recursive: true });
//   fs.writeFileSync(
//     path.join(projectPath, "public/index.html"),
//     `<!DOCTYPE html><html><head><script src="https://unpkg.com/vue@3/dist/vue.global.js"></script><script type="module" src="./HelloWorld.js"></script></head><body><div id="app"></div><script>const { createApp } = Vue; createApp({ components: { HelloWorld } }).mount('#app');</script></body></html>`
//   );
//   fs.writeFileSync(
//     path.join(projectPath, "public/HelloWorld.js"),
//     `export const HelloWorld = { props: ['msg'], template: '<h1>{{ msg }}</h1>' };`
//   );
//   fs.writeFileSync(
//     path.join(projectPath, "deno.json"),
//     JSON.stringify(
//       { tasks: { start: "deno run --allow-net --allow-read public/index.html" } },
//       null,
//       2
//     )
//   );
// }

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

main();