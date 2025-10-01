#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer, { Answers } from "inquirer";
import { generateViteReact } from "./generate_vite_react.ts";
import { generateViteVue } from "./generate_vite_vue.ts";
import { generateFresh } from './generate_fresh.ts'
// import { generateVueCDN } from "./generate_vue_CDN.ts";
import { type Framework, type Runtime, type PackageManager, type ValidationLibrary, type ErrorHandlingLibrary, type TestingLibrary, type VueStateLibrary, type ReactStateLibrary, type StateLibrary } from "./types.ts";

const frameworks: Framework[] = ["react", "vue3"];
const runtimes: Runtime[] = ["node", "bun", "deno"];
const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
const validationLibraries: ValidationLibrary[] = ["zod", "yup", "io-ts", "superstruct", "valibot", "runtypes", "none"];
const errorHandlingLibraries: ErrorHandlingLibrary[] = ["neverthrow", "ts-results", "oxide.ts", "true-myth", "purify-ts", "fp-ts", "none"];
const testingLibraries: TestingLibrary[] = ["jest", "vitest", "cypress", "playwright", "puppeteer", "react-testing-library", "none"];
const vueStateLibraries: VueStateLibrary[] = ["pinia", "valtio", "nanostores", "mobx", "redux-toolkit-query", "none"];
const reactStateLibraries: ReactStateLibrary[] = ["redux", "zustand", "recoil", "jotai", "mobx", "valtio", "nanostores", "redux-toolkit-query", "none"];

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
    {
      type: "list",
      name: "errorHandlingLibrary",
      message: "选择异常处理库:",
      choices: errorHandlingLibraries,
    },
    {
      type: "list",
      name: "testingLibrary",
      message: "选择测试库:",
      choices: testingLibraries,
    },
    {
      type: "list",
      name: "stateLibrary",
      message: "选择全局状态管理库:",
      choices: function(answers) {
        if (answers.framework === "vue3") {
          return vueStateLibraries;
        } else {
          return reactStateLibraries;
        }
      },
      when: function() {
        return true;
      }
    },
  ]);

  const framework = answers.framework as Framework;
  const runtime = answers.runtime as Runtime;
  const pkgManager = answers.pkgManager as PackageManager;
  const validationLibrary = answers.validationLibrary as ValidationLibrary;
  const errorHandlingLibrary = answers.errorHandlingLibrary as ErrorHandlingLibrary;
  const testingLibrary = answers.testingLibrary as TestingLibrary;
  const stateLibrary = answers.stateLibrary as StateLibrary;

  const projectName = `${framework}-${runtime}-app`;
  fs.mkdirSync(projectName, { recursive: true });

  const projectPath = path.join(process.cwd(), projectName);
  
  // 根据选择生成不同模板
  if (runtime === "node" || runtime === "bun") {
    if (framework === "react") {
      generateViteReact(projectPath, validationLibrary, errorHandlingLibrary, testingLibrary, stateLibrary as ReactStateLibrary);
    } else {
      generateViteVue(projectPath, validationLibrary, errorHandlingLibrary, testingLibrary, stateLibrary as VueStateLibrary);
    }
  } else if (runtime === "deno") {
    if (framework === "react") {
      generateFresh(projectPath, errorHandlingLibrary, testingLibrary, stateLibrary);
    } else {
      // generateVueCDN(projectPath, errorHandlingLibrary, testingLibrary, stateLibrary as VueStateLibrary);
    }
  }

  // 生成 README
  generateReadme(projectPath, framework, runtime, pkgManager, validationLibrary, errorHandlingLibrary, testingLibrary, stateLibrary);

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

function generateReadme(projectPath: string, framework: Framework, runtime: Runtime, pkgManager: PackageManager, validationLibrary: ValidationLibrary, errorHandlingLibrary: ErrorHandlingLibrary, testingLibrary: TestingLibrary, stateLibrary: string) {
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
  if (errorHandlingLibrary === "neverthrow") {
    features.push("Neverthrow 异常处理");
  } else if (errorHandlingLibrary === "ts-results") {
    features.push("ts-results 异常处理");
  } else if (errorHandlingLibrary === "oxide.ts") {
    features.push("oxide.ts 异常处理");
  } else if (errorHandlingLibrary === "true-myth") {
    features.push("true-myth 异常处理");
  } else if (errorHandlingLibrary === "purify-ts") {
    features.push("purify-ts 异常处理");
  } else if (errorHandlingLibrary === "fp-ts") {
    features.push("fp-ts 异常处理");
  }
  if (testingLibrary === "jest") {
    features.push("Jest 测试框架");
  } else if (testingLibrary === "vitest") {
    features.push("Vitest 测试框架");
  } else if (testingLibrary === "cypress") {
    features.push("Cypress 端到端测试");
  } else if (testingLibrary === "playwright") {
    features.push("Playwright 端到端测试");
  } else if (testingLibrary === "puppeteer") {
    features.push("Puppeteer 自动化测试");
  } else if (testingLibrary === "react-testing-library") {
      features.push("✅ 使用 React Testing Library 进行组件测试");
    }
    if (stateLibrary !== "none") {
      features.push(`✅ 使用 ${stateLibrary} 进行全局状态管理`);
    }
  
  fs.writeFileSync(
    path.join(projectPath, "README.md"),
    `# ${framework} + ${runtime} Starter\n\n## 特性\n\n${features.map(feature => `- ${feature}`).join('\n')}\n\n## 开发\n\n\`${chosen.install}\`\n\n然后运行:\n\n\`${chosen.dev}\``
  );
}

main();