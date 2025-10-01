#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer, { Answers } from "inquirer";
import { generateViteReact } from "./generate_vite_react.ts";
import { generateViteVue } from "./generate_vite_vue.ts";
import { generateFresh } from './generate_fresh.ts'
import { generateVueCDN } from "./generate_vue_CDN.ts";
import { type Framework, type Runtime, type PackageManager, type ValidationLibrary } from "./types.ts";

const frameworks: Framework[] = ["react", "vue3"];
const runtimes: Runtime[] = ["node", "bun", "deno"];
const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
const validationLibraries: ValidationLibrary[] = ["zod", "yup", "io-ts", "superstruct", "valibot", "runtypes", "none"];

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
    {
      type: "list",
      name: "validationLibrary",
      message: "选择验证库:",
      choices: validationLibraries,
    },
  ]);

  const framework = answers.framework as Framework;
  const runtime = answers.runtime as Runtime;
  const pkgManager = answers.pkgManager as PackageManager;
  const validationLibrary = answers.validationLibrary as ValidationLibrary;

  const projectName = `${framework}-${runtime}-app`;
  fs.mkdirSync(projectName, { recursive: true });

  const projectPath = path.join(process.cwd(), projectName);
  
  // 根据选择生成不同模板
  if (runtime === "node" || runtime === "bun") {
    if (framework === "react") {
      generateViteReact(projectPath, validationLibrary);
    } else {
      generateViteVue(projectPath, validationLibrary);
    }
  } else if (runtime === "deno") {
    if (framework === "react") {
      generateFresh(projectPath);
    } else {
      generateVueCDN(projectPath);
    }
  }

  // 生成 README
  generateReadme(projectPath, framework, runtime, pkgManager, validationLibrary);

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

function generateReadme(projectPath: string, framework: Framework, runtime: Runtime, pkgManager: PackageManager, validationLibrary: ValidationLibrary) {
  const cmds = {
    npm: { install: "npm install", dev: "npm run dev" },
    pnpm: { install: "pnpm install", dev: "pnpm dev" },
    yarn: { install: "yarn install", dev: "yarn dev" },
    bun: { install: "bun install", dev: "bun dev" },
  };

  const chosen = cmds[pkgManager];
  const features = ["基本项目结构"];
  if (validationLibrary === "zod") {
    features.push("Zod 数据验证");
  }
  
  fs.writeFileSync(
    path.join(projectPath, "README.md"),
    `# ${framework} + ${runtime} Starter\n\n## 特性\n\n${features.map(feature => `- ${feature}`).join('\n')}\n\n## 开发\n\n\`${chosen.install}\`\n\n然后运行:\n\n\`${chosen.dev}\``
  );
}

main();