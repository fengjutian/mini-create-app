#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer, { Answers } from "inquirer";
import { generateViteReact } from "./generate_vite_react.ts";
import { generateViteVue } from "./generate_vite_vue.ts";
import { generateFresh } from './generate_fresh.ts'
// import { generateVueCDN } from "./generate_vue_CDN.ts";
import { type Framework, type Runtime, type PackageManager, type ValidationLibrary, type ErrorHandlingLibrary, type TestingLibrary, type VueStateLibrary, type ReactStateLibrary, type StateLibrary, type ReactUILibrary, type VueUILibrary, type UILibrary } from "./types.ts";

// 定义所有可选配置
const frameworks: Framework[] = ["react", "vue3"];
const runtimes: Runtime[] = ["node", "bun", "deno"];
const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
const validationLibraries: ValidationLibrary[] = ["none", "zod", "yup", "io-ts", "superstruct", "valibot", "runtypes"];
const errorHandlingLibraries: ErrorHandlingLibrary[] = ["none", "neverthrow", "ts-results", "oxide.ts", "true-myth", "purify-ts", "fp-ts"];
const testingLibraries: TestingLibrary[] = ["none", "jest", "vitest", "cypress", "playwright", "puppeteer", "react-testing-library"];
const vueStateLibraries: VueStateLibrary[] = ["none", "pinia", "valtio", "nanostores", "mobx", "redux-toolkit-query"];
const reactStateLibraries: ReactStateLibrary[] = ["none", "redux", "zustand", "recoil", "jotai", "mobx", "valtio", "nanostores", "redux-toolkit-query"];
const reactUILibraries: ReactUILibrary[] = ["none", "mui", "antd", "chakra-ui", "blueprint", "fluent-ui", "headless-ui", "radix-ui", "mantine", "nextui"];
const vueUILibraries: VueUILibrary[] = ["none", "vuetify", "naive-ui", "element-plus", "ant-design-vue", "primevue", "vant", "quasar", "tdesign-vue-next"];

// 预设模板选项
const presets = [
  { name: "✨ 快速开始 (React + Node + Vite)", value: "react-node" },
  { name: "✨ 快速开始 (Vue3 + Node + Vite)", value: "vue3-node" },
  { name: "🛠️ 自定义配置", value: "custom" }
];

// 清除屏幕函数
function clearScreen() {
  console.log("\x1Bc");
}

// 显示欢迎信息
function showWelcome() {
  clearScreen();
  console.log(`
🎉 欢迎使用 Mini Create App 🎉
`);
  console.log(`这是一个现代化的应用生成工具，可以帮助你快速创建配置完善的前端项目。\n`);
}

// 显示选择总结
function showSelectionSummary(answers: Answers) {
  clearScreen();
  console.log(`\n📋 项目配置总结\n`);
  console.log(`🎨 框架: ${answers.framework}`);
  console.log(`⚙️ 运行环境: ${answers.runtime}`);
  console.log(`📦 包管理器: ${answers.pkgManager}`);
  console.log(`🔍 验证库: ${answers.validationLibrary}`);
  console.log(`🛡️ 异常处理库: ${answers.errorHandlingLibrary}`);
  console.log(`🧪 测试库: ${answers.testingLibrary}`);
  console.log(`📊 状态管理库: ${answers.stateLibrary}`);
  console.log(`🎨 UI库: ${answers.uiLibrary}\n`);
}

async function main() {
  showWelcome();

  // 步骤1: 选择预设或自定义配置
  const presetAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "preset",
      message: "请选择创建方式:",
      choices: presets,
      default: "custom"
    }
  ]);

  let answers: Answers = {};

  if (presetAnswer.preset === "react-node") {
    // React + Node 预设
    answers = {
      framework: "react",
      runtime: "node",
      pkgManager: "npm",
      validationLibrary: "zod",
      errorHandlingLibrary: "neverthrow",
      testingLibrary: "vitest",
      stateLibrary: "zustand",
      uiLibrary: "none"
    };
  } else if (presetAnswer.preset === "vue3-node") {
    // Vue3 + Node 预设
    answers = {
      framework: "vue3",
      runtime: "node",
      pkgManager: "npm",
      validationLibrary: "zod",
      errorHandlingLibrary: "neverthrow",
      testingLibrary: "vitest",
      stateLibrary: "pinia",
      uiLibrary: "none"
    };
  } else {
    // 步骤2: 核心配置选择
    const coreAnswers = await inquirer.prompt([
      {
        type: "list",
        name: "framework",
        message: "🎨 选择框架:",
        choices: frameworks,
        default: "react"
      },
      {
        type: "list",
        name: "runtime",
        message: "⚙️ 选择运行环境:",
        choices: runtimes,
        default: "node"
      },
      {
        type: "list",
        name: "pkgManager",
        message: "📦 选择包管理器:",
        choices: packageManagers,
        default: "npm"
      }
    ]);

    answers = { ...coreAnswers };

    // 步骤3: 功能模块选择
    console.log(`\n🚀 现在选择你需要的功能模块 (可选择 'none' 跳过)\n`);
    const featureAnswers = await inquirer.prompt([
      {
        type: "list",
        name: "validationLibrary",
        message: "🔍 选择验证库:",
        choices: validationLibraries,
        default: "none"
      },
      {
        type: "list",
        name: "errorHandlingLibrary",
        message: "🛡️ 选择异常处理库:",
        choices: errorHandlingLibraries,
        default: "none"
      },
      {
        type: "list",
        name: "testingLibrary",
        message: "🧪 选择测试库:",
        choices: testingLibraries,
        default: "none"
      },
      {
        type: "list",
        name: "stateLibrary",
        message: "📊 选择全局状态管理库:",
        choices: function() {
          if (answers.framework === "vue3") {
            return vueStateLibraries;
          } else {
            return reactStateLibraries;
          }
        },
        default: "none"
      },
      {
        type: "list",
        name: "uiLibrary",
        message: "🎨 选择UI库:",
        choices: function() {
          if (answers.framework === "vue3") {
            return vueUILibraries;
          } else {
            return reactUILibraries;
          }
        },
        default: "none"
      },
    ]);

    answers = { ...answers, ...featureAnswers };
  }

  // 显示选择总结并确认
  showSelectionSummary(answers);
  
  const confirmAnswer = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "确认使用以上配置创建项目吗?",
      default: true
    }
  ]);

  if (!confirmAnswer.confirm) {
    console.log("\n🛑 项目创建已取消。");
    return;
  }

  const framework = answers.framework as Framework;
  const runtime = answers.runtime as Runtime;
  const pkgManager = answers.pkgManager as PackageManager;
  const validationLibrary = answers.validationLibrary as ValidationLibrary;
  const errorHandlingLibrary = answers.errorHandlingLibrary as ErrorHandlingLibrary;
  const testingLibrary = answers.testingLibrary as TestingLibrary;
  const stateLibrary = answers.stateLibrary as StateLibrary;
  const uiLibrary = answers.uiLibrary as UILibrary;

  const projectName = `${framework}-${runtime}-app`;
  fs.mkdirSync(projectName, { recursive: true });

  const projectPath = path.join(process.cwd(), projectName);
  
  // 根据选择生成不同模板
  console.log(`\n🚀 正在生成项目...\n`);
  
  if (runtime === "node" || runtime === "bun") {
    if (framework === "react") {
      generateViteReact(projectPath, validationLibrary, errorHandlingLibrary, testingLibrary, stateLibrary as ReactStateLibrary, uiLibrary as ReactUILibrary);
    } else {
      generateViteVue(projectPath, validationLibrary, errorHandlingLibrary, testingLibrary, stateLibrary as VueStateLibrary, uiLibrary as VueUILibrary);
    }
  } else if (runtime === "deno") {
    if (framework === "react") {
      generateFresh(projectPath, errorHandlingLibrary, testingLibrary, stateLibrary);
    } else {
      // generateVueCDN(projectPath, errorHandlingLibrary, testingLibrary, stateLibrary as VueStateLibrary);
    }
  }

  // 生成 README
  generateReadme(projectPath, framework, runtime, pkgManager, validationLibrary, errorHandlingLibrary, testingLibrary, stateLibrary, uiLibrary);

  console.log(`\n✅ 项目已生成: ${projectName}`);
  console.log(`\n🚀 接下来运行:`);
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

function generateReadme(projectPath: string, framework: Framework, runtime: Runtime, pkgManager: PackageManager, validationLibrary: ValidationLibrary, errorHandlingLibrary: ErrorHandlingLibrary, testingLibrary: TestingLibrary, stateLibrary: string, uiLibrary: UILibrary) {
  const cmds = {
    npm: { install: "npm install", dev: "npm run dev" },
    pnpm: { install: "pnpm install", dev: "pnpm dev" },
    yarn: { install: "yarn install", dev: "yarn dev" },
    bun: { install: "bun install", dev: "bun dev" },
  };

  const chosen = cmds[pkgManager];
  const features = ["🏗️ 基本项目结构"];
  if (validationLibrary === "zod") {
    features.push("🔍 Zod 数据验证");
  } else if (validationLibrary === "yup") {
    features.push("🔍 Yup 数据验证");
  } else if (validationLibrary === "io-ts") {
    features.push("🔍 io-ts 数据验证");
  } else if (validationLibrary === "superstruct") {
    features.push("🔍 superstruct 数据验证");
  } else if (validationLibrary === "valibot") {
    features.push("🔍 valibot 数据验证");
  } else if (validationLibrary === "runtypes") {
    features.push("🔍 runtypes 数据验证");
  }
  if (errorHandlingLibrary === "neverthrow") {
    features.push("🛡️ Neverthrow 异常处理");
  } else if (errorHandlingLibrary === "ts-results") {
    features.push("🛡️ ts-results 异常处理");
  } else if (errorHandlingLibrary === "oxide.ts") {
    features.push("🛡️ oxide.ts 异常处理");
  } else if (errorHandlingLibrary === "true-myth") {
    features.push("🛡️ true-myth 异常处理");
  } else if (errorHandlingLibrary === "purify-ts") {
    features.push("🛡️ purify-ts 异常处理");
  } else if (errorHandlingLibrary === "fp-ts") {
    features.push("🛡️ fp-ts 异常处理");
  }
  if (testingLibrary === "jest") {
    features.push("🧪 Jest 测试框架");
  } else if (testingLibrary === "vitest") {
    features.push("🧪 Vitest 测试框架");
  } else if (testingLibrary === "cypress") {
    features.push("🧪 Cypress 端到端测试");
  } else if (testingLibrary === "playwright") {
    features.push("🧪 Playwright 端到端测试");
  } else if (testingLibrary === "puppeteer") {
    features.push("🧪 Puppeteer 自动化测试");
  } else if (testingLibrary === "react-testing-library") {
      features.push("🧪 使用 React Testing Library 进行组件测试");
    }
    if (stateLibrary !== "none") {
      features.push(`📊 使用 ${stateLibrary} 进行全局状态管理`);
    }
    if (uiLibrary !== "none") {
      features.push(`🎨 使用 ${uiLibrary} UI 库`);
    }
  
  fs.writeFileSync(
    path.join(projectPath, "README.md"),
    `# ${framework} + ${runtime} Starter 🚀\n\n## 特性\n\n${features.map(feature => `- ${feature}`).join('\n')}\n\n## 开发\n\n\`${chosen.install}\`\n\n然后运行:\n\n\`${chosen.dev}\``
  );
}

main();