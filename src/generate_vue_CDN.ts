import fs from "node:fs";
import * as path from "path";
import { type ErrorHandlingLibrary, type TestingLibrary, type VueStateLibrary } from "./types.js";

export function generateVueCDN(
  projectPath: string,
  errorHandlingLibrary: ErrorHandlingLibrary,
  testingLibrary: TestingLibrary,
  stateLibrary: VueStateLibrary
) {
  // 创建项目目录结构
  fs.mkdirSync(path.join(projectPath, "public"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "src"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "src/components"), { recursive: true });
  
  // 根据选择的状态库创建相应目录
  if (stateLibrary && stateLibrary !== "none") {
    fs.mkdirSync(path.join(projectPath, "src/stores"), { recursive: true });
  }

  // 生成Deno配置文件
  const imports: Record<string, string> = {};
  
  // 添加错误处理库依赖
  if (errorHandlingLibrary === "neverthrow") {
    imports["neverthrow"] = "https://deno.land/x/neverthrow@v6.0.0/mod.ts";
  } else if (errorHandlingLibrary === "fp-ts") {
    imports["fp-ts"] = "https://deno.land/x/fp_ts@v2.16.0/lib/index.ts";
  } else if (errorHandlingLibrary === "ts-results") {
    imports["ts-results"] = "https://esm.sh/ts-results@3.3.0";
  }
  
  // 添加测试库依赖
  if (testingLibrary === "vitest") {
    imports["vitest"] = "https://esm.sh/vitest@1.1.0";
    imports["@testing-library/vue"] = "https://esm.sh/@testing-library/vue@7.0.0";
  }
  
  // 添加状态库依赖
  if (stateLibrary === "pinia") {
    imports["pinia"] = "https://esm.sh/pinia@2.1.7";
  } else if (stateLibrary === "valtio") {
    imports["valtio"] = "https://esm.sh/valtio@1.11.2";
  } else if (stateLibrary === "nanostores") {
    imports["nanostores"] = "https://esm.sh/nanostores@0.9.5";
    imports["nanostores/vue"] = "https://esm.sh/nanostores@0.9.5/vue";
  }
  
  // 生成deno.json配置
  fs.writeFileSync(
    path.join(projectPath, "deno.json"),
    JSON.stringify(
      {
        tasks: {
          start: "deno run --allow-net --allow-read --allow-write serve.ts",
          test: "deno test"
        },
        imports: Object.keys(imports).length > 0 ? imports : undefined
      },
      null,
      2
    )
  );

  // 生成简易的Deno服务器文件
  fs.writeFileSync(
    path.join(projectPath, "serve.ts"),
    `import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.192.0/http/file_server.ts";

const server = serve({
  port: 8000,
});

console.log("Vue3 + Deno server running on http://localhost:8000");

for await (const request of server) {
  const response = await serveDir(request, {
    fsRoot: ".",
    showDirListing: true,
    quiet: false,
  });
  request.respondWith(response);
}`
  );

  // 生成index.html作为入口文件，使用CDN引入Vue3
  fs.writeFileSync(
    path.join(projectPath, "index.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue3 + Deno App</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  ${stateLibrary === "pinia" ? '<script src="https://unpkg.com/pinia@2/dist/pinia.iife.js"></script>' : ''}
  <link rel="stylesheet" href="./public/style.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./src/main.js"></script>
</body>
</html>`
  );

  // 生成CSS样式文件
  fs.writeFileSync(
    path.join(projectPath, "public/style.css"),
    `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3aa876;
}`
  );

  // 生成main.js入口文件
  let mainJsContent = `import { createApp } from 'vue';
import App from './App.vue';
`;

  // 根据选择的状态库添加相应的代码
  if (stateLibrary === "pinia") {
    mainJsContent += `import { createPinia } from 'pinia';
import { useCounterStore } from './stores/counter';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');
`;
  } else if (stateLibrary === "valtio") {
    mainJsContent += `import { proxy } from 'valtio';
import { useSnapshot } from 'valtio';
import counterStore from './stores/counter';

// 将store挂载到app全局属性
const app = createApp(App);
app.config.globalProperties.$counterStore = counterStore;
app.mount('#app');
`;
  } else if (stateLibrary === "nanostores") {
    mainJsContent += `import counter from './stores/counter';

// 将store挂载到app全局属性
const app = createApp(App);
app.config.globalProperties.$counter = counter;
app.mount('#app');
`;
  } else {
    mainJsContent += `const app = createApp(App);
app.mount('#app');
`;
  }

  fs.writeFileSync(
    path.join(projectPath, "src/main.js"),
    mainJsContent
  );

  // 生成App.vue组件
  fs.writeFileSync(
    path.join(projectPath, "src/App.vue"),
    `<template>
  <div class="app">
    <h1>Vue3 + Deno App</h1>
    <p>🎉 欢迎使用 Vue3 和 Deno 构建的应用程序！</p>
    <Counter />
  </div>
</template>

<script>
import Counter from './components/Counter.vue';

export default {
  name: 'App',
  components: {
    Counter
  }
};
</script>

<style scoped>
.app {
  text-align: center;
  margin-top: 50px;
}

h1 {
  color: #42b983;
  margin-bottom: 20px;
}
</style>`
  );

  // 根据状态库类型生成相应的状态管理代码
  if (stateLibrary === "pinia") {
    // Pinia配置
    fs.writeFileSync(
      path.join(projectPath, "src/stores/counter.js"),
      `import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++;
    }
  }
});`
    );

    // Pinia版本的Counter组件
    fs.writeFileSync(
      path.join(projectPath, "src/components/Counter.vue"),
      `<template>
  <div class="counter">
    <h2>Pinia Counter</h2>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <button @click="counter.increment()">Increment</button>
  </div>
</template>

<script>
import { useCounterStore } from '../stores/counter';

export default {
  name: 'Counter',
  setup() {
    const counter = useCounterStore();
    return {
      counter
    };
  }
};
</script>`
    );
  } else if (stateLibrary === "valtio") {
    // Valtio配置
    fs.writeFileSync(
      path.join(projectPath, "src/stores/counter.js"),
      `import { proxy } from 'valtio';

export default proxy({
  count: 0,
  increment() {
    this.count++;
  }
});`
    );

    // Valtio版本的Counter组件
    fs.writeFileSync(
      path.join(projectPath, "src/components/Counter.vue"),
      `<template>
  <div class="counter">
    <h2>Valtio Counter</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useSnapshot } from 'valtio';
import counterStore from '../stores/counter';

export default {
  name: 'Counter',
  setup() {
    const snapshot = useSnapshot(counterStore);
    return {
      count: snapshot.count,
      increment: counterStore.increment
    };
  }
};
</script>`
    );
  } else if (stateLibrary === "nanostores") {
    // Nanostores配置
    fs.writeFileSync(
      path.join(projectPath, "src/stores/counter.js"),
      `import { atom } from 'nanostores';

export const counter = atom(0);

export function increment() {
  counter.set(counter.get() + 1);
}`
    );

    // Nanostores版本的Counter组件
    fs.writeFileSync(
      path.join(projectPath, "src/components/Counter.vue"),
      `<template>
  <div class="counter">
    <h2>Nanostores Counter</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useStore } from 'nanostores/vue';
import { counter, increment } from '../stores/counter';

export default {
  name: 'Counter',
  setup() {
    const count = useStore(counter);
    return {
      count,
      increment
    };
  }
};
</script>`
    );
  } else {
    // 如果没有选择状态库，使用Vue3的Composition API
    fs.writeFileSync(
      path.join(projectPath, "src/components/Counter.vue"),
      `<template>
  <div class="counter">
    <h2>Vue3 Counter</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Counter',
  setup() {
    const count = ref(0);
    const increment = () => {
      count.value++;
    };
    return {
      count,
      increment
    };
  }
};
</script>`
    );
  }

  // 如果选择了错误处理库，生成示例代码
  if (errorHandlingLibrary === "neverthrow") {
    fs.writeFileSync(
      path.join(projectPath, "src/error-handling-example.js"),
      `import { ok, err } from 'neverthrow';

// 示例：使用neverthrow处理可能失败的操作
export function parseNumber(value) {
  const num = Number(value);
  if (isNaN(num)) {
    return err(new Error('Invalid number'));
  }
  return ok(num);
}

// 使用示例
// const result = parseNumber('123');
// result.map(num => console.log(num));
// result.mapErr(err => console.error(err));`
    );
  }

  // 如果选择了测试库，生成测试配置和示例
  if (testingLibrary === "vitest") {
    fs.writeFileSync(
      path.join(projectPath, "vite.config.js"),
      `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom'
  }
});`
    );

    fs.writeFileSync(
      path.join(projectPath, "src/components/Counter.test.js"),
      `import { mount } from '@testing-library/vue';
import Counter from './Counter.vue';

test('Counter increments when button is clicked', async () => {
  const wrapper = mount(Counter);
  
  expect(wrapper.text()).toContain('Count: 0');
  
  await wrapper.find('button').trigger('click');
  
  expect(wrapper.text()).toContain('Count: 1');
});`
    );
  }
}