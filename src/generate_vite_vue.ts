import fs from 'node:fs';
import path from 'node:path';
import { type ValidationLibrary, type ErrorHandlingLibrary, type TestingLibrary, type VueStateLibrary, type VueUILibrary } from './types.js';

export function generateViteVue(
  projectPath: string,
  validationLibrary: ValidationLibrary,
  errorHandlingLibrary: ErrorHandlingLibrary,
  testingLibrary: TestingLibrary,
  stateLibrary: VueStateLibrary,
  uiLibrary: VueUILibrary
) {
  // 创建基础目录结构
  fs.mkdirSync(path.join(projectPath, 'src/components'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src/routes'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src/stores'), { recursive: true });

  // 生成 package.json
  const pkg = {
    name: 'vite-vue-app',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts',
      typecheck: 'vue-tsc --noEmit'
    },
    dependencies: {
      vue: '^3.4.0',
      'vue-router': '^4.2.0',
      ...(stateLibrary === 'pinia' ? { pinia: '^2.1.0' } : {}),
      ...(stateLibrary === 'valtio' ? { valtio: '^1.10.0' } : {}),
      ...(stateLibrary === 'nanostores' ? { nanostores: '^0.9.6', '@nanostores/vue': '^0.8.0' } : {}),
      ...(stateLibrary === 'mobx' ? { mobx: '^6.12.0', 'mobx-vue-lite': '^4.0.0' } : {}),
      ...(stateLibrary === 'redux-toolkit-query' ? { '@reduxjs/toolkit': '^2.2.0', 'react-redux': '^9.1.0' } : {}),
      ...(validationLibrary === 'zod' ? { zod: '^3.23.0' } : {}),
      ...(validationLibrary === 'yup' ? { yup: '^1.4.0' } : {}),
      ...(validationLibrary === 'io-ts' ? { 'io-ts': '^2.2.20' } : {}),
      ...(validationLibrary === 'superstruct' ? { superstruct: '^1.0.3' } : {}),
      ...(validationLibrary === 'valibot' ? { valibot: '^0.30.0' } : {}),
      ...(validationLibrary === 'runtypes' ? { runtypes: '^6.7.0' } : {}),
      ...(errorHandlingLibrary === 'neverthrow' ? { neverthrow: '^6.0.0' } : {}),
      ...(errorHandlingLibrary === 'ts-results' ? { 'ts-results': '^3.3.0' } : {}),
      ...(errorHandlingLibrary === 'oxide.ts' ? { 'oxide.ts': '^1.0.0' } : {}),
      ...(errorHandlingLibrary === 'true-myth' ? { 'true-myth': '^6.1.0' } : {}),
      ...(errorHandlingLibrary === 'purify-ts' ? { 'purify-ts': '^1.4.0' } : {}),
      ...(errorHandlingLibrary === 'fp-ts' ? { 'fp-ts': '^2.16.0' } : {}),
      ...(uiLibrary === 'vuetify' ? { 'vuetify': '^3.4.0' } : {}),
      ...(uiLibrary === 'naive-ui' ? { 'naive-ui': '^2.38.0', 'vueuc': '^0.4.0' } : {}),
      ...(uiLibrary === 'element-plus' ? { 'element-plus': '^2.4.0' } : {}),
      ...(uiLibrary === 'ant-design-vue' ? { 'ant-design-vue': '^4.0.0' } : {}),
      ...(uiLibrary === 'primevue' ? { 'primevue': '^3.40.0', 'primeicons': '^6.0.0' } : {}),
      ...(uiLibrary === 'vant' ? { 'vant': '^4.8.0' } : {}),
      ...(uiLibrary === 'quasar' ? { 'quasar': '^2.14.0' } : {}),
      ...(uiLibrary === 'tdesign-vue-next' ? { 'tdesign-vue-next': '^1.9.0' } : {})
    },
    devDependencies: {
      vite: '^5.0.0',
      '@vitejs/plugin-vue': '^5.0.0',
      typescript: '^5.3.0',
      'vue-tsc': '^1.8.0',
      eslint: '^8.50.0',
      '@typescript-eslint/parser': '^6.7.0',
      '@typescript-eslint/eslint-plugin': '^6.7.0',
      'eslint-plugin-vue': '^9.17.0',
      prettier: '^3.0.0',
      'eslint-config-prettier': '^9.0.0',
      ...(testingLibrary === 'jest' ? { 'jest': '^29.7.0', '@types/jest': '^29.5.0', 'ts-jest': '^29.1.0' } : {}),
      ...(testingLibrary === 'vitest' ? { 'vitest': '^1.0.0', '@vitest/ui': '^1.0.0' } : {}),
      ...(testingLibrary === 'cypress' ? { 'cypress': '^13.0.0' } : {}),
      ...(testingLibrary === 'playwright' ? { '@playwright/test': '^1.38.0' } : {})
    }
  };

  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(pkg, null, 2)
  );

  // 生成 vite.config.ts
  fs.writeFileSync(
    path.join(projectPath, 'vite.config.ts'),
    `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});`
  );

  // 生成 tsconfig.json
  fs.writeFileSync(
    path.join(projectPath, 'tsconfig.json'),
    `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
  );

  // 生成 tsconfig.node.json
  fs.writeFileSync(
    path.join(projectPath, 'tsconfig.node.json'),
    `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
  );

  // 生成 index.html
  fs.writeFileSync(
    path.join(projectPath, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`
  );

  // 创建 stores 目录
  fs.mkdirSync(path.join(projectPath, 'src/stores'), { recursive: true });

  // 生成 main.ts
  if (stateLibrary === 'pinia') {
    fs.writeFileSync(
      path.join(projectPath, 'src/main.ts'),
      `import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');`
    );
    
    // 生成 Pinia store
    fs.writeFileSync(
      path.join(projectPath, 'src/stores/counter.ts'),
      `import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});`
    );
  } else if (stateLibrary === 'valtio') {
    fs.writeFileSync(
      path.join(projectPath, 'src/main.ts'),
      `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');`
    );
    
    // 生成 Valtio store
    fs.writeFileSync(
      path.join(projectPath, 'src/stores/store.ts'),
      `import { proxy } from 'valtio';

export const store = proxy({
  count: 0,
});

export function increment() {
  store.count++;
}`
    );
  } else if (stateLibrary === 'nanostores') {
    fs.writeFileSync(
      path.join(projectPath, 'src/main.ts'),
      `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');`
    );
    
    // 生成 Nanostores
    fs.writeFileSync(
      path.join(projectPath, 'src/stores/counter.ts'),
      `import { atom } from 'nanostores';

export const counter = atom(0);

export function increment() {
  counter.set(counter.get() + 1);
}`
    );
  } else if (stateLibrary === 'mobx') {
    fs.writeFileSync(
      path.join(projectPath, 'src/main.ts'),
      `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');`
    );
    
    // 生成 MobX store
    fs.writeFileSync(
      path.join(projectPath, 'src/stores/CounterStore.ts'),
      `import { makeAutoObservable } from 'mobx';

export class CounterStore {
  count = 0;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  increment() {
    this.count++;
  }
}`
    );
    
    fs.writeFileSync(
      path.join(projectPath, 'src/stores/index.ts'),
      `import { CounterStore } from './CounterStore';

export const counterStore = new CounterStore();`
    );
  } else if (stateLibrary === 'redux-toolkit-query') {
    fs.writeFileSync(
      path.join(projectPath, 'src/main.ts'),
      `import { createApp } from 'vue';
import { Provider } from 'react-redux';
import { store } from './stores';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');`
    );
    
    // 生成 Redux store
    fs.writeFileSync(
      path.join(projectPath, 'src/stores/store.ts'),
      `import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`
    );
    
    fs.writeFileSync(
      path.join(projectPath, 'src/stores/counterSlice.ts'),
      `import { createSlice } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
    },
  },
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;`
    );
  } else {
    // 默认 main.ts
    fs.writeFileSync(
      path.join(projectPath, 'src/main.ts'),
      `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');`
    );
  }

  // 生成 router.ts
  fs.writeFileSync(
    path.join(projectPath, 'src/router.ts'),
    `import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/AboutView.vue')
    }
  ]
});

export default router;`
  );

  // 生成 App.vue
  fs.writeFileSync(
    path.join(projectPath, 'src/App.vue'),
    `<script setup lang="ts">
</script>

<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <p>Vite + Vue + TypeScript</p>
  </footer>
</template>

<style scoped>
header {
  border-bottom: 1px solid #eaeaea;
  padding: 20px 0;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
}

nav a:hover {
  color: #0070f3;
}

footer {
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #eaeaea;
  text-align: center;
}
</style>`
  );

  // 生成 views 目录和视图组件
  fs.mkdirSync(path.join(projectPath, 'src/views'), { recursive: true });
  
  // 生成 HomeView.vue
  let homeViewContent = `<script setup lang="ts">
`;
  
  if (stateLibrary === 'pinia') {
    homeViewContent += `import { useCounterStore } from '../stores/counter';
const counterStore = useCounterStore();`;
  } else if (stateLibrary === 'valtio') {
    homeViewContent += `import { store, increment } from '../stores/store';
import { useSnapshot } from 'valtio';
const snap = useSnapshot(store);`;
  } else if (stateLibrary === 'nanostores') {
    homeViewContent += `import { counter, increment } from '../stores/counter';
import { useStore } from '@nanostores/vue';
const count = useStore(counter);`;
  } else if (stateLibrary === 'mobx') {
    homeViewContent += `import { counterStore } from '../stores';
import { useLocalObservable } from 'mobx-vue-lite';
const store = useLocalObservable(() => counterStore);`;
  } else if (stateLibrary === 'redux-toolkit-query') {
    homeViewContent += `import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../stores/counterSlice';
import type { RootState } from '../stores/store';
const count = useSelector((state: RootState) => state.counter.value);
const dispatch = useDispatch();`;
  } else {
    homeViewContent += `import { ref } from 'vue';
const count = ref(0);
function increment() {
  count.value++;
}`;
  }
  
  homeViewContent += `
</script>

<template>
  <div>
    <h1>Vite + Vue + TypeScript</h1>
    <div class="card">
      <button @click="`;
      
  if (stateLibrary === 'pinia') {
    homeViewContent += `counterStore.increment()`;
  } else if (stateLibrary === 'valtio') {
    homeViewContent += `increment()`;
  } else if (stateLibrary === 'nanostores') {
    homeViewContent += `increment()`;
  } else if (stateLibrary === 'mobx') {
    homeViewContent += `store.increment()`;
  } else if (stateLibrary === 'redux-toolkit-query') {
    homeViewContent += `dispatch(increment())`;
  } else {
    homeViewContent += `increment()`;
  }
  
  homeViewContent += `">
        count is `;
        
  if (stateLibrary === 'pinia') {
    homeViewContent += `{{ counterStore.count }}`;
  } else if (stateLibrary === 'valtio') {
    homeViewContent += `{{ snap.count }}`;
  } else if (stateLibrary === 'nanostores') {
    homeViewContent += `{{ count }}`;
  } else if (stateLibrary === 'mobx') {
    homeViewContent += `{{ store.count }}`;
  } else if (stateLibrary === 'redux-toolkit-query') {
    homeViewContent += `{{ count }}`;
  } else {
    homeViewContent += `{{ count }}`;
  }
  
  homeViewContent += `
      </button>
      <p>
        Edit <code>src/App.vue</code> and save to test HMR
      </p>
    </div>
    <p class="read-the-docs">
      Click on the Vite and Vue logos to learn more
    </p>
  </div>
</template>

<style scoped>
.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
</style>`;
  
  fs.writeFileSync(
    path.join(projectPath, 'src/views/HomeView.vue'),
    homeViewContent
  );

  // 生成 AboutView.vue
  fs.writeFileSync(
    path.join(projectPath, 'src/views/AboutView.vue'),
    `<script setup lang="ts">
</script>

<template>
  <div>
    <h1>About</h1>
    <p>This is an about page</p>
  </div>
</template>`
  );

  // 生成 .eslintrc.cjs
  fs.writeFileSync(
    path.join(projectPath, '.eslintrc.cjs'),
    `module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {},
};
`
  );

  // 生成 .prettierrc
  fs.writeFileSync(
    path.join(projectPath, '.prettierrc'),
    `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "endOfLine": "lf"
}
`
  );

  // 生成 .gitignore
  fs.writeFileSync(
    path.join(projectPath, '.gitignore'),
    `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# Test coverage
coverage
*.lcov
.nyc_output

# TypeScript
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
`
  );

  // 如果选择了验证库，添加示例代码
  if (validationLibrary === 'zod') {
    fs.mkdirSync(path.join(projectPath, 'src/validation'), { recursive: true });
    fs.writeFileSync(
      path.join(projectPath, 'src/validation/userSchema.ts'),
      `import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要2个字符' }),
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  age: z.number().min(18, { message: '年龄必须大于或等于18岁' }),
});

export type User = z.infer<typeof userSchema>;
`
    );
  }

  // 如果选择了测试库，添加测试配置
  if (testingLibrary === 'jest') {
    fs.writeFileSync(
      path.join(projectPath, 'jest.config.ts'),
      `import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['vue', 'ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
`
    );
    
    fs.writeFileSync(
      path.join(projectPath, 'src/components/Hello.vue'),
      `<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  msg: string;
}>();

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is {{ count }}</button>
</template>
`
    );
    
    // 先创建__tests__目录
    fs.mkdirSync(path.join(projectPath, 'src/components/__tests__'), { recursive: true });
    
    fs.writeFileSync(
      path.join(projectPath, 'src/components/__tests__/Hello.spec.ts'),
      `import { mount } from '@vue/test-utils';
import Hello from '../Hello.vue';

describe('Hello.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = mount(Hello, {
      props: {
        msg,
      },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
`
    );
  }
}