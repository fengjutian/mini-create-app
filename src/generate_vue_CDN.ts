import path from 'node:path';
import { promises as fs } from 'node:fs';
import { type ErrorHandlingLibrary, type TestingLibrary, type VueStateLibrary } from './types.ts';

export async function generateVueCDN(
  projectPath: string,
  errorHandlingLibrary: ErrorHandlingLibrary,
  testingLibrary: TestingLibrary,
  stateLibrary: VueStateLibrary
) {
  try {
    // 创建基础目录结构
    await fs.mkdir(path.join(projectPath, 'components'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'stores'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'pages'), { recursive: true });

    // 生成 deno.json 配置文件
    const imports: Record<string, string> = {};
    
    // 添加错误处理库依赖
    if (errorHandlingLibrary === 'neverthrow') {
      imports['neverthrow/'] = 'https://deno.land/x/neverthrow@v6.0.0/';
    } else if (errorHandlingLibrary === 'fp-ts') {
      imports['fp-ts/'] = 'https://deno.land/x/fp_ts@v2.16.0/';
    }
    
    // 添加测试库依赖
    if (testingLibrary === 'jest') {
      imports['@testing-library/react/'] = 'https://deno.land/x/testing_library_react@v14.0.0/';
    }
    
    // 添加状态库依赖
    if (stateLibrary === 'pinia') {
      imports['pinia/'] = 'https://esm.sh/pinia@2.1.6';
    } else if (stateLibrary === 'valtio') {
      imports['valtio/'] = 'https://esm.sh/valtio@1.10.7';
    } else if (stateLibrary === 'nanostores') {
      imports['nanostores/'] = 'https://esm.sh/nanostores@0.9.6';
      imports['@nanostores/vue/'] = 'https://esm.sh/@nanostores/vue@0.8.0';
    } else if (stateLibrary === 'mobx') {
      imports['mobx/'] = 'https://esm.sh/mobx@6.12.0';
      imports['mobx-vue-lite/'] = 'https://esm.sh/mobx-vue-lite@4.0.0';
    } else if (stateLibrary === 'redux-toolkit-query') {
      imports['@reduxjs/toolkit/'] = 'https://esm.sh/@reduxjs/toolkit@2.2.0';
      imports['react-redux/'] = 'https://esm.sh/react-redux@9.1.0';
    }
    
    await fs.writeFile(
      path.join(projectPath, 'deno.json'),
      JSON.stringify(
        {
          tasks: {
            start: 'deno run --allow-net --allow-read index.ts',
            dev: 'deno run --allow-net --allow-read --watch index.ts'
          },
          imports: Object.keys(imports).length > 0 ? imports : undefined
        },
        null,
        2
      )
    );

    // 生成 index.html
    let indexHtmlContent = '<!DOCTYPE html>\n';
    indexHtmlContent += '<html lang="en">\n';
    indexHtmlContent += '<head>\n';
    indexHtmlContent += '  <meta charset="UTF-8">\n';
    indexHtmlContent += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    indexHtmlContent += '  <title>Vue CDN App</title>\n';
    indexHtmlContent += '  <!-- Vue 3 -->\n';
    indexHtmlContent += '  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>\n';
    indexHtmlContent += '  <!-- Vue Router -->\n';
    indexHtmlContent += '  <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>';
    
    // 添加状态管理库 CDN
    if (stateLibrary === 'pinia') {
      indexHtmlContent += '\n  <!-- Pinia -->\n  <script src="https://unpkg.com/pinia@2/dist/pinia.iife.js"></script>';
    } else if (stateLibrary === 'valtio') {
      indexHtmlContent += '\n  <!-- Valtio -->\n  <script src="https://unpkg.com/valtio@1.10.7/dist/valtio.iife.js"></script>';
    } else if (stateLibrary === 'nanostores') {
      indexHtmlContent += '\n  <!-- Nanostores -->\n  <script src="https://unpkg.com/nanostores@0.9.6/dist/nanostores.iife.js"></script>\n  <script src="https://unpkg.com/@nanostores/vue@0.8.0/dist/index.iife.js"></script>';
    } else if (stateLibrary === 'mobx') {
      indexHtmlContent += '\n  <!-- MobX -->\n  <script src="https://unpkg.com/mobx@6.12.0/dist/mobx.umd.production.min.js"></script>\n  <script src="https://unpkg.com/mobx-vue-lite@4.0.0/dist/mobx-vue-lite.umd.production.min.js"></script>';
    } else if (stateLibrary === 'redux-toolkit-query') {
      indexHtmlContent += '\n  <!-- Redux -->\n  <script src="https://unpkg.com/redux@4.2.1/dist/redux.min.js"></script>\n  <script src="https://unpkg.com/react-redux@9.1.0/dist/react-redux.umd.min.js"></script>\n  <script src="https://unpkg.com/@reduxjs/toolkit@2.2.0/dist/redux-toolkit.umd.min.js"></script>';
    }
    
    // 添加错误处理库 CDN
    if (errorHandlingLibrary === 'neverthrow') {
      indexHtmlContent += '\n  <!-- Neverthrow -->\n  <script src="https://cdn.jsdelivr.net/npm/neverthrow@6.0.0/dist/neverthrow.umd.min.js"></script>';
    }
    
    indexHtmlContent += '\n  <style>\n';
    indexHtmlContent += '    body {\n';
    indexHtmlContent += '      font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n';
    indexHtmlContent += '      margin: 0;\n';
    indexHtmlContent += '      padding: 0;\n';
    indexHtmlContent += '      color: #333;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    .container {\n';
    indexHtmlContent += '      max-width: 800px;\n';
    indexHtmlContent += '      margin: 0 auto;\n';
    indexHtmlContent += '      padding: 20px;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    header {\n';
    indexHtmlContent += '      border-bottom: 1px solid #eaeaea;\n';
    indexHtmlContent += '      padding: 20px 0;\n';
    indexHtmlContent += '      margin-bottom: 20px;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    nav {\n';
    indexHtmlContent += '      display: flex;\n';
    indexHtmlContent += '      gap: 20px;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    nav a {\n';
    indexHtmlContent += '      text-decoration: none;\n';
    indexHtmlContent += '      color: #333;\n';
    indexHtmlContent += '      padding: 5px 10px;\n';
    indexHtmlContent += '      border-radius: 4px;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    nav a:hover {\n';
    indexHtmlContent += '      background-color: #f0f0f0;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    .card {\n';
    indexHtmlContent += '      border: 1px solid #eaeaea;\n';
    indexHtmlContent += '      border-radius: 8px;\n';
    indexHtmlContent += '      padding: 20px;\n';
    indexHtmlContent += '      margin: 20px 0;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    button {\n';
    indexHtmlContent += '      padding: 8px 16px;\n';
    indexHtmlContent += '      background-color: #42b883;\n';
    indexHtmlContent += '      color: white;\n';
    indexHtmlContent += '      border: none;\n';
    indexHtmlContent += '      border-radius: 4px;\n';
    indexHtmlContent += '      cursor: pointer;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    button:hover {\n';
    indexHtmlContent += '      background-color: #35495e;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '    footer {\n';
    indexHtmlContent += '      margin-top: 40px;\n';
    indexHtmlContent += '      padding: 20px 0;\n';
    indexHtmlContent += '      border-top: 1px solid #eaeaea;\n';
    indexHtmlContent += '      text-align: center;\n';
    indexHtmlContent += '      color: #888;\n';
    indexHtmlContent += '    }\n';
    indexHtmlContent += '  </style>\n';
    indexHtmlContent += '</head>\n';
    indexHtmlContent += '<body>\n';
    indexHtmlContent += '  <div id="app"></div>\n';
    indexHtmlContent += '  <script type="module" src="/main.js"></script>\n';
    indexHtmlContent += '</body>\n';
    indexHtmlContent += '</html>';
    
    await fs.writeFile(path.join(projectPath, 'index.html'), indexHtmlContent);

    // 生成 index.ts (Deno 入口文件)
    const indexTsContent = 'import { serve } from "https://deno.land/std@0.202.0/http/server.ts";\n';
    indexTsContent += 'import { serveDir } from "https://deno.land/std@0.202.0/http/file_server.ts";\n\n';
    indexTsContent += 'const PORT = 8000;\n\n';
    indexTsContent += 'console.log(\'服务运行在 http://localhost:\' + PORT);\n\n';
    indexTsContent += 'await serve(\n';
    indexTsContent += '  (req) => {\n';
    indexTsContent += '    const pathname = new URL(req.url).pathname;\n';
    indexTsContent += '    \n';
    indexTsContent += '    // 处理静态文件\n';
    indexTsContent += '    if (pathname === \'/\') {\n';
    indexTsContent += '      return new Response(Deno.readFileSync(\'./index.html\'), {\n';
    indexTsContent += '        headers: { \'content-type\': \'text/html\' },\n';
    indexTsContent += '      });\n';
    indexTsContent += '    }\n';
    indexTsContent += '    \n';
    indexTsContent += '    return serveDir(req, {\n';
    indexTsContent += '      fsRoot: \'.\',\n';
    indexTsContent += '      urlRoot: \'\',\n';
    indexTsContent += '      showDirListing: false,\n';
    indexTsContent += '      enableCors: true,\n';
    indexTsContent += '    });\n';
    indexTsContent += '  },\n';
    indexTsContent += '  { port: PORT }\n';
    indexTsContent += ');';
    
    await fs.writeFile(path.join(projectPath, 'index.ts'), indexTsContent);

    // 生成 main.js (Vue 应用入口)
    let mainJsContent = '// Vue 应用入口文件\n';
    mainJsContent += 'const { createApp, ref, computed, onMounted } = Vue;\n';
    mainJsContent += 'const { createRouter, createWebHistory } = VueRouter;';

    if (stateLibrary === 'pinia') {
      mainJsContent += '\nconst { createPinia } = Pinia;';
    }

    mainJsContent += '\n\n// 导入页面组件\n';
    mainJsContent += 'import HomePage from \'./pages/HomePage.js\';\n';
    mainJsContent += 'import AboutPage from \'./pages/AboutPage.js\';\n\n';
    mainJsContent += '// 创建路由\n';
    mainJsContent += 'const router = createRouter({\n';
    mainJsContent += '  history: createWebHistory(),\n';
    mainJsContent += '  routes: [\n';
    mainJsContent += '    {\n';
    mainJsContent += '      path: \'/\',\n';
    mainJsContent += '      name: \'home\',\n';
    mainJsContent += '      component: HomePage\n';
    mainJsContent += '    },\n';
    mainJsContent += '    {\n';
    mainJsContent += '      path: \'/about\',\n';
    mainJsContent += '      name: \'about\',\n';
    mainJsContent += '      component: AboutPage\n';
    mainJsContent += '    }\n';
    mainJsContent += '  ]\n';
    mainJsContent += '});\n\n';
    mainJsContent += '// 创建应用\n';
    mainJsContent += 'const app = createApp({\n';
    mainJsContent += '  template: \'\n';
    mainJsContent += '    <div class="container">\n';
    mainJsContent += '      <header>\n';
    mainJsContent += '        <h1>Vue CDN App</h1>\n';
    mainJsContent += '        <nav>\n';
    mainJsContent += '          <router-link to="/">Home</router-link>\n';
    mainJsContent += '          <router-link to="/about">About</router-link>\n';
    mainJsContent += '        </nav>\n';
    mainJsContent += '      </header>\n';
    mainJsContent += '      <router-view />\n';
    mainJsContent += '      <footer>\n';
    mainJsContent += '        <p>使用 Vue 3 + CDN 构建</p>\n';
    mainJsContent += '      </footer>\n';
    mainJsContent += '    </div>\n';
    mainJsContent += '  \'\n';
    mainJsContent += '});';

    if (stateLibrary === 'pinia') {
      mainJsContent += '\n\n// 使用 Pinia\n';
      mainJsContent += 'const pinia = createPinia();\n';
      mainJsContent += 'app.use(pinia);';
    }

    mainJsContent += '\n\n// 使用路由\n';
    mainJsContent += 'app.use(router);\n\n';
    mainJsContent += '// 挂载应用\n';
    mainJsContent += 'app.mount(\'#app\');';

    await fs.writeFile(path.join(projectPath, 'main.js'), mainJsContent);

    // 生成 HomePage.js
    let homePageContent = '// Home 页面组件\n';
    homePageContent += 'export default {\n';
    homePageContent += '  setup() {\n';

    if (stateLibrary === 'pinia') {
      homePageContent += '    // 使用 Pinia store\n';
      homePageContent += '    import useCounterStore from \'../stores/counter.js\';\n';
      homePageContent += '    const counterStore = useCounterStore();';
    } else if (stateLibrary === 'valtio') {
      homePageContent += '    // 使用 Valtio store\n';
      homePageContent += '    const { store, increment } = await import(\'../stores/store.js\');\n';
      homePageContent += '    const snap = VueValtio.useSnapshot(store);';
    } else if (stateLibrary === 'nanostores') {
      homePageContent += '    // 使用 Nanostores\n';
      homePageContent += '    const { counter, increment } = await import(\'../stores/counter.js\');\n';
      homePageContent += '    const count = NanostoresVue.useStore(counter);';
    } else if (stateLibrary === 'mobx') {
      homePageContent += '    // 使用 MobX store\n';
      homePageContent += '    const { counterStore } = await import(\'../stores/store.js\');\n';
      homePageContent += '    const store = MobxVueLite.useLocalObservable(() => counterStore);';
    } else {
      homePageContent += '    // 使用 Vue 内置状态\n';
      homePageContent += '    const count = Vue.ref(0);\n';
      homePageContent += '    function increment() {\n';
      homePageContent += '      count.value++;\n';
      homePageContent += '    }';
    }

    homePageContent += '\n\n    return {\n';

    if (stateLibrary === 'pinia') {
      homePageContent += '      counterStore';
    } else if (stateLibrary === 'valtio') {
      homePageContent += '      snap, increment';
    } else if (stateLibrary === 'nanostores') {
      homePageContent += '      count, increment';
    } else if (stateLibrary === 'mobx') {
      homePageContent += '      store';
    } else {
      homePageContent += '      count, increment';
    }

    homePageContent += '\n    };\n';
    homePageContent += '  },\n';
    homePageContent += '  template: \'';

    let templateContent = '';
    if (stateLibrary === 'pinia') {
      templateContent = '\n    <div class="card">\n';
      templateContent += '      <h2>Pinia 计数器</h2>\n';
      templateContent += '      <p>当前计数: {{ counterStore.count }}</p>\n';
      templateContent += '      <p>双倍计数: {{ counterStore.doubleCount }}</p>\n';
      templateContent += '      <button @click="counterStore.increment">+1</button>\n';
      templateContent += '    </div>\n';
      templateContent += '    <div class="card">\n';
      templateContent += '      <h2>关于这个应用</h2>\n';
      templateContent += '      <p>这是一个使用 Vue 3 + CDN + Deno 构建的应用。</p>\n';
      templateContent += '      <p>点击计数器按钮来测试状态管理功能。</p>\n';
      templateContent += '    </div>';
    } else if (stateLibrary === 'valtio') {
      templateContent = '\n    <div class="card">\n';
      templateContent += '      <h2>Valtio 计数器</h2>\n';
      templateContent += '      <p>当前计数: {{ snap.count }}</p>\n';
      templateContent += '      <button @click="increment">+1</button>\n';
      templateContent += '    </div>\n';
      templateContent += '    <div class="card">\n';
      templateContent += '      <h2>关于这个应用</h2>\n';
      templateContent += '      <p>这是一个使用 Vue 3 + CDN + Deno 构建的应用。</p>\n';
      templateContent += '      <p>点击计数器按钮来测试状态管理功能。</p>\n';
      templateContent += '    </div>';
    } else if (stateLibrary === 'nanostores') {
      templateContent = '\n    <div class="card">\n';
      templateContent += '      <h2>Nanostores 计数器</h2>\n';
      templateContent += '      <p>当前计数: {{ count }}</p>\n';
      templateContent += '      <button @click="increment">+1</button>\n';
      templateContent += '    </div>\n';
      templateContent += '    <div class="card">\n';
      templateContent += '      <h2>关于这个应用</h2>\n';
      templateContent += '      <p>这是一个使用 Vue 3 + CDN + Deno 构建的应用。</p>\n';
      templateContent += '      <p>点击计数器按钮来测试状态管理功能。</p>\n';
      templateContent += '    </div>';
    } else if (stateLibrary === 'mobx') {
      templateContent = '\n    <div class="card">\n';
      templateContent += '      <h2>MobX 计数器</h2>\n';
      templateContent += '      <p>当前计数: {{ store.count }}</p>\n';
      templateContent += '      <p>双倍计数: {{ store.doubleCount }}</p>\n';
      templateContent += '      <button @click="store.increment">+1</button>\n';
      templateContent += '    </div>\n';
      templateContent += '    <div class="card">\n';
      templateContent += '      <h2>关于这个应用</h2>\n';
      templateContent += '      <p>这是一个使用 Vue 3 + CDN + Deno 构建的应用。</p>\n';
      templateContent += '      <p>点击计数器按钮来测试状态管理功能。</p>\n';
      templateContent += '    </div>';
    } else {
      templateContent = '\n    <div class="card">\n';
      templateContent += '      <h2>Vue 计数器</h2>\n';
      templateContent += '      <p>当前计数: {{ count }}</p>\n';
      templateContent += '      <button @click="increment">+1</button>\n';
      templateContent += '    </div>\n';
      templateContent += '    <div class="card">\n';
      templateContent += '      <h2>关于这个应用</h2>\n';
      templateContent += '      <p>这是一个使用 Vue 3 + CDN + Deno 构建的应用。</p>\n';
      templateContent += '      <p>点击计数器按钮来测试状态管理功能。</p>\n';
      templateContent += '    </div>';
    }

    homePageContent += templateContent + '\n  \'\n';
    homePageContent += '};';

    await fs.writeFile(path.join(projectPath, 'pages/HomePage.js'), homePageContent);

    // 生成 AboutPage.js
    const aboutPageContent = '// About 页面组件\n';
    aboutPageContent += 'export default {\n';
    aboutPageContent += '  template: \'\n';
    aboutPageContent += '    <div class="card">\n';
    aboutPageContent += '      <h2>关于我们</h2>\n';
    aboutPageContent += '      <p>这是一个使用 Vue 3 + CDN + Deno 构建的示例应用。</p>\n';
    aboutPageContent += '      <h3>特性</h3>\n';
    aboutPageContent += '      <ul>\n';
    aboutPageContent += '        <li>使用 Vue 3 Composition API</li>\n';
    aboutPageContent += '        <li>Vue Router 实现页面路由</li>\n';
    aboutPageContent += '        <li>Deno 作为运行时环境</li>\n';
    aboutPageContent += '        <li>纯前端 CDN 方式加载依赖</li>\n';
    aboutPageContent += '        <li>支持多种状态管理库</li>\n';
    aboutPageContent += '        <li>支持多种错误处理库</li>\n';
    aboutPageContent += '      </ul>\n';
    aboutPageContent += '    </div>\n';
    aboutPageContent += '  \'\n';
    aboutPageContent += '};';
    
    await fs.writeFile(path.join(projectPath, 'pages/AboutPage.js'), aboutPageContent);

    // 根据状态库类型生成相应的状态管理代码
    if (stateLibrary === 'pinia') {
      // Pinia store
      const piniaStoreContent = '// Pinia Counter Store\n';
      piniaStoreContent += 'export default function useCounterStore() {\n';
      piniaStoreContent += '  const { defineStore } = Pinia;\n';
      piniaStoreContent += '  \n';
      piniaStoreContent += '  return defineStore(\'counter\', {\n';
      piniaStoreContent += '    state: () => ({\n';
      piniaStoreContent += '      count: 0,\n';
      piniaStoreContent += '    }),\n';
      piniaStoreContent += '    getters: {\n';
      piniaStoreContent += '      doubleCount: (state) => state.count * 2,\n';
      piniaStoreContent += '    },\n';
      piniaStoreContent += '    actions: {\n';
      piniaStoreContent += '      increment() {\n';
      piniaStoreContent += '        this.count++;\n';
      piniaStoreContent += '      },\n';
      piniaStoreContent += '    },\n';
      piniaStoreContent += '  })();\n';
      piniaStoreContent += '}';
      
      await fs.writeFile(path.join(projectPath, 'stores/counter.js'), piniaStoreContent);
    } else if (stateLibrary === 'valtio') {
      // Valtio store
      const valtioStoreContent = '// Valtio Store\n';
      valtioStoreContent += 'const { proxy } = Valtio;\n\n';
      valtioStoreContent += 'export const store = proxy({\n';
      valtioStoreContent += '  count: 0,\n';
      valtioStoreContent += '});\n\n';
      valtioStoreContent += 'export function increment() {\n';
      valtioStoreContent += '  store.count++;\n';
      valtioStoreContent += '}';
      
      await fs.writeFile(path.join(projectPath, 'stores/store.js'), valtioStoreContent);
    } else if (stateLibrary === 'nanostores') {
      // Nanostores
      const nanostoresContent = '// Nanostores Counter\n';
      nanostoresContent += 'const { atom } = Nanostores;\n\n';
      nanostoresContent += 'export const counter = atom(0);\n\n';
      nanostoresContent += 'export function increment() {\n';
      nanostoresContent += '  counter.set(counter.get() + 1);\n';
      nanostoresContent += '}';
      
      await fs.writeFile(path.join(projectPath, 'stores/counter.js'), nanostoresContent);
    } else if (stateLibrary === 'mobx') {
      // MobX store
      const mobxStoreContent = '// MobX Store\n';
      mobxStoreContent += 'const { makeAutoObservable } = MobX;\n\n';
      mobxStoreContent += 'class CounterStore {\n';
      mobxStoreContent += '  count = 0;\n';
      mobxStoreContent += '  \n';
      mobxStoreContent += '  constructor() {\n';
      mobxStoreContent += '    makeAutoObservable(this);\n';
      mobxStoreContent += '  }\n';
      mobxStoreContent += '  \n';
      mobxStoreContent += '  increment() {\n';
      mobxStoreContent += '    this.count++;\n';
      mobxStoreContent += '  }\n';
      mobxStoreContent += '  \n';
      mobxStoreContent += '  get doubleCount() {\n';
      mobxStoreContent += '    return this.count * 2;\n';
      mobxStoreContent += '  }\n';
      mobxStoreContent += '}\n\n';
      mobxStoreContent += 'export const counterStore = new CounterStore();';
      
      await fs.writeFile(path.join(projectPath, 'stores/store.js'), mobxStoreContent);
    } else if (stateLibrary === 'redux-toolkit-query') {
      // Redux store
      const reduxStoreContent = '// Redux Store\n';
      reduxStoreContent += 'const { configureStore, createSlice } = RTK;\n\n';
      reduxStoreContent += '// Counter Slice\n';
      reduxStoreContent += 'const counterSlice = createSlice({\n';
      reduxStoreContent += '  name: \'counter\',\n';
      reduxStoreContent += '  initialState: {\n';
      reduxStoreContent += '    value: 0,\n';
      reduxStoreContent += '  },\n';
      reduxStoreContent += '  reducers: {\n';
      reduxStoreContent += '    increment: (state) => {\n';
      reduxStoreContent += '      state.value++;\n';
      reduxStoreContent += '    },\n';
      reduxStoreContent += '  },\n';
      reduxStoreContent += '});\n\n';
      reduxStoreContent += 'export const { increment } = counterSlice.actions;\n\n';
      reduxStoreContent += 'export const store = configureStore({\n';
      reduxStoreContent += '  reducer: {\n';
      reduxStoreContent += '    counter: counterSlice.reducer,\n';
      reduxStoreContent += '  },\n';
      reduxStoreContent += '});';
      
      await fs.writeFile(path.join(projectPath, 'stores/store.js'), reduxStoreContent);
      
      // 修改 main.js 以支持 Redux
      const currentMainJsContent = await fs.readFile(path.join(projectPath, 'main.js'), 'utf8');
      const updatedMainJsContent = currentMainJsContent
        .replace('// 导入页面组件', '// 导入页面组件\nimport { store } from \'./stores/store.js\';') 
        .replace('// 使用路由', '// 使用路由\napp.use(router);\n\n// 全局注入 store\napp.provide(\'store\', store);');
      
      await fs.writeFile(path.join(projectPath, 'main.js'), updatedMainJsContent);
      
      // 修改 HomePage.js 以使用 Redux
      const currentHomePageJsContent = await fs.readFile(path.join(projectPath, 'pages/HomePage.js'), 'utf8');
      const updatedHomePageJsContent = currentHomePageJsContent
        .replace('// 使用 Vue 内置状态\n    const count = Vue.ref(0);\n    function increment() {\n      count.value++;\n    }', '// 使用 Redux store\n    const store = inject(\'store\');\n    const count = Vue.computed(() => store.getState().counter.value);\n    function increment() {\n      store.dispatch({ type: \'counter/increment\' });\n    }');
      
      await fs.writeFile(path.join(projectPath, 'pages/HomePage.js'), updatedHomePageJsContent);
    }

    // 如果选择了错误处理库，添加示例代码
    if (errorHandlingLibrary === 'neverthrow') {
      const errorHandlingContent = '// Neverthrow 错误处理示例\n';
      errorHandlingContent += 'export default {\n';
      errorHandlingContent += '  setup() {\n';
      errorHandlingContent += '    const { Ok, Err } = neverthrow;\n';
      errorHandlingContent += '    const result = Vue.ref(null);\n';
      errorHandlingContent += '    \n';
      errorHandlingContent += '    function validateInput(input) {\n';
      errorHandlingContent += '      if (input.length < 3) {\n';
      errorHandlingContent += '        return Err(\'输入长度至少需要3个字符\');\n';
      errorHandlingContent += '      }\n';
      errorHandlingContent += '      return Ok(input);\n';
      errorHandlingContent += '    }\n';
      errorHandlingContent += '    \n';
      errorHandlingContent += '    function handleSubmit() {\n';
      errorHandlingContent += '      const input = document.getElementById(\'error-input\').value;\n';
      errorHandlingContent += '      result.value = validateInput(input);\n';
      errorHandlingContent += '      \n';
      errorHandlingContent += '      result.value.match(\n';
      errorHandlingContent += '        (value) => alert(\'验证成功: \' + value),\n';
      errorHandlingContent += '        (error) => alert(\'验证失败: \' + error)\n';
      errorHandlingContent += '      );\n';
      errorHandlingContent += '    }\n';
      errorHandlingContent += '    \n';
      errorHandlingContent += '    return {\n';
      errorHandlingContent += '      handleSubmit\n';
      errorHandlingContent += '    };\n';
      errorHandlingContent += '  },\n';
      errorHandlingContent += '  template: \'\n';
      errorHandlingContent += '    <div class="card">\n';
      errorHandlingContent += '      <h2>错误处理示例</h2>\n';
      errorHandlingContent += '      <input id="error-input" type="text" placeholder="请输入至少3个字符">\n';
      errorHandlingContent += '      <button @click="handleSubmit">验证</button>\n';
      errorHandlingContent += '    </div>\n';
      errorHandlingContent += '  \'\n';
      errorHandlingContent += '};';
      
      await fs.writeFile(path.join(projectPath, 'components/ErrorHandlingExample.js'), errorHandlingContent);
      
      // 在 HomePage 中添加错误处理示例组件
      const currentHomePageContent = await fs.readFile(path.join(projectPath, 'pages/HomePage.js'), 'utf8');
      const updatedHomePageWithErrorHandling = currentHomePageContent
        .replace('// 导入页面组件', '// 导入页面组件\nimport ErrorHandlingExample from \'../components/ErrorHandlingExample.js\';')
        .replace('export default {', 'export default {\n  components: {\n    ErrorHandlingExample\n  },')
        .replace('</div>', '</div>\n      <ErrorHandlingExample />');
      
      await fs.writeFile(path.join(projectPath, 'pages/HomePage.js'), updatedHomePageWithErrorHandling);
    }

    // 生成 .gitignore
    const gitignoreContent = '# Logs\n';
    gitignoreContent += 'logs\n';
    gitignoreContent += '*.log\n\n';
    gitignoreContent += '# Deno\n';
    gitignoreContent += '.Deno\n\n';
    gitignoreContent += '# Editor directories and files\n';
    gitignoreContent += '.vscode/*\n';
    gitignoreContent += '!.vscode/extensions.json\n';
    gitignoreContent += '.idea\n';
    gitignoreContent += '.DS_Store\n';
    gitignoreContent += '*.suo\n';
    gitignoreContent += '*.ntvs*\n';
    gitignoreContent += '*.njsproj\n';
    gitignoreContent += '*.sln\n';
    gitignoreContent += '*.sw?\n\n';
    gitignoreContent += '# Environment variables\n';
    gitignoreContent += '.env\n';
    gitignoreContent += '.env.local\n';
    gitignoreContent += '.env.production.local\n';
    gitignoreContent += '.env.development.local\n';
    gitignoreContent += '.env.test.local\n\n';
    gitignoreContent += '# Temporary folders\n';
    gitignoreContent += 'tmp/\n';
    gitignoreContent += 'temp/';
    
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

    // 生成 README.md
    const stateLibText = stateLibrary !== 'none' ? stateLibrary + ' 状态管理' : '无状态管理';
    const errorLibText = errorHandlingLibrary !== 'none' ? errorHandlingLibrary + ' 错误处理' : '无错误处理库';
    const reduxNote = stateLibrary === 'redux-toolkit-query' ? '# 注意：Redux Toolkit Query 在纯 CDN 模式下可能需要额外配置\n' : '';
    
    const readmeContent = '# Vue CDN App\n\n';
    readmeContent += '这是一个使用 Vue 3 + CDN + Deno 构建的应用。\n\n';
    readmeContent += '## 特性\n';
    readmeContent += '- Vue 3 Composition API\n';
    readmeContent += '- Vue Router 路由管理\n';
    readmeContent += '- ' + stateLibText + '\n';
    readmeContent += '- ' + errorLibText + '\n';
    readmeContent += '- Deno 运行时环境\n\n';
    readmeContent += '## 快速开始\n\n';
    readmeContent += '确保你已经安装了 Deno：\n\n';
    readmeContent += '```bash\n';
    readmeContent += '# 启动开发服务器\n';
    readmeContent += reduxNote;
    readmeContent += 'deno task dev\n';
    readmeContent += '```\n\n';
    readmeContent += '## 构建说明\n\n';
    readmeContent += '这个项目是基于 CDN 的，不需要构建步骤。直接运行 Deno 服务器即可。\n\n';
    readmeContent += '## 项目结构\n';
    readmeContent += '- `index.ts`: Deno 服务器入口\n';
    readmeContent += '- `index.html`: HTML 入口文件，包含 CDN 依赖\n';
    readmeContent += '- `main.js`: Vue 应用入口\n';
    readmeContent += '- `pages/`: 页面组件\n';
    readmeContent += '- `components/`: 通用组件\n';
    readmeContent += '- `stores/`: 状态管理\n';
    
    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
  } catch (error) {
    console.error('生成 Vue CDN 项目时出错:', error);
    throw error;
  }
}