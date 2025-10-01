import fs from "fs";
import path from "path";
import { type ValidationLibrary, type ErrorHandlingLibrary, type TestingLibrary, type ReactStateLibrary, type ReactUILibrary } from "./types.js";
export function generateViteReact(projectPath: string, validationLibrary: ValidationLibrary, errorHandlingLibrary: ErrorHandlingLibrary, testingLibrary: TestingLibrary, stateLibrary: ReactStateLibrary, uiLibrary: ReactUILibrary) {
  // create folders
  fs.mkdirSync(path.join(projectPath, "src/components"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "src/routes"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "src/stores"), { recursive: true });

  // package.json: include react-router-dom and zustand + eslint/prettier devDeps
  const pkg = {
    name: "vite-react-app",
    private: true,
    scripts: { 
      dev: "vite", 
      build: "vite build", 
      preview: "vite preview", 
      lint: "eslint src --ext .ts,.tsx",
      typecheck: "tsc --noEmit" // 添加类型检查脚本
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.9.0",
      ...(stateLibrary === "zustand" || stateLibrary === "none" ? { "zustand": "^4.1.0" } : {}),
      ...(stateLibrary === "redux" ? { "redux": "^4.2.0", "react-redux": "^8.0.0", "@reduxjs/toolkit": "^1.9.0" } : {}),
      ...(stateLibrary === "recoil" ? { "recoil": "^0.7.0" } : {}),
      ...(stateLibrary === "jotai" ? { "jotai": "^2.0.0" } : {}),
      ...(stateLibrary === "mobx" ? { "mobx": "^6.8.0", "mobx-react-lite": "^3.4.0" } : {}),
      ...(stateLibrary === "valtio" ? { "valtio": "^1.0.0" } : {}),
      ...(stateLibrary === "nanostores" ? { "nanostores": "^0.9.0", "@nanostores/react": "^0.7.0" } : {}),
      ...(stateLibrary === "redux-toolkit-query" ? { "@reduxjs/toolkit": "^1.9.0", "react-redux": "^8.0.0" } : {}),
      ...(validationLibrary === "zod" ? { "zod": "^3.22.0" } : {}),
      ...(validationLibrary === "yup" ? { "yup": "^1.2.0" } : {}),
      ...(validationLibrary === "io-ts" ? { "io-ts": "^2.2.20" } : {}),
      ...(validationLibrary === "superstruct" ? { "superstruct": "^1.0.3" } : {}),
      ...(validationLibrary === "valibot" ? { "valibot": "^0.28.0" } : {}),
      ...(validationLibrary === "runtypes" ? { "runtypes": "^6.7.0" } : {}),
      ...(errorHandlingLibrary === "neverthrow" ? { "neverthrow": "^6.0.0" } : {}),
      ...(errorHandlingLibrary === "ts-results" ? { "ts-results": "^3.3.0" } : {}),
      ...(errorHandlingLibrary === "oxide.ts" ? { "oxide.ts": "^1.0.0" } : {}),
      ...(errorHandlingLibrary === "true-myth" ? { "true-myth": "^6.1.0" } : {}),
      ...(errorHandlingLibrary === "purify-ts" ? { "purify-ts": "^1.4.0" } : {}),
      ...(errorHandlingLibrary === "fp-ts" ? { "fp-ts": "^2.16.0" } : {}),
      ...(uiLibrary === "mui" ? { "@mui/material": "^5.15.0", "@emotion/react": "^11.11.0", "@emotion/styled": "^11.11.0" } : {}),
      ...(uiLibrary === "antd" ? { "antd": "^5.12.0" } : {}),
      ...(uiLibrary === "chakra-ui" ? { "@chakra-ui/react": "^2.8.0", "@emotion/react": "^11.11.0", "@emotion/styled": "^11.11.0", "framer-motion": "^10.16.0" } : {}),
      ...(uiLibrary === "blueprint" ? { "@blueprintjs/core": "^5.9.0" } : {}),
      ...(uiLibrary === "fluent-ui" ? { "@fluentui/react": "^8.110.0" } : {}),
      ...(uiLibrary === "headless-ui" ? { "@headlessui/react": "^1.7.17" } : {}),
      ...(uiLibrary === "radix-ui" ? { "@radix-ui/react-dialog": "^1.0.4", "@radix-ui/react-button": "^1.0.3" } : {}),
      ...(uiLibrary === "mantine" ? { "@mantine/core": "^7.2.0", "@mantine/hooks": "^7.2.0", "@emotion/react": "^11.11.0" } : {}),
      ...(uiLibrary === "nextui" ? { "@nextui-org/react": "^2.2.0", "framer-motion": "^10.16.0" } : {})
    },
    devDependencies: {
      vite: "^4.0.0",
      typescript: "^5.0.0",
      "@vitejs/plugin-react": "^3.0.0",
      eslint: "^8.40.0",
      "@typescript-eslint/parser": "^5.59.0",
      "@typescript-eslint/eslint-plugin": "^5.59.0",
      prettier: "^2.8.8",
      "eslint-config-prettier": "^8.8.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "@types/react-router-dom": "^5.3.3",
      ...(testingLibrary === "jest" ? { "jest": "^29.0.0", "@types/jest": "^29.0.0", "ts-jest": "^29.0.0" } : {}),
      ...(testingLibrary === "vitest" ? { "vitest": "^0.30.0", "@vitest/ui": "^0.30.0" } : {}),
      ...(testingLibrary === "cypress" ? { "cypress": "^12.0.0" } : {}),
      ...(testingLibrary === "playwright" ? { "@playwright/test": "^1.30.0" } : {}),
      ...(testingLibrary === "puppeteer" ? { "puppeteer": "^19.0.0" } : {}),
      ...(testingLibrary === "react-testing-library" ? { "@testing-library/react": "^14.0.0", "@testing-library/jest-dom": "^5.16.0", "@testing-library/user-event": "^14.0.0" } : {})
    }
  };
  fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify(pkg, null, 2));

  // eslint config
  fs.writeFileSync(
    path.join(projectPath, ".eslintrc.json"),
    JSON.stringify({
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaVersion: 2020, sourceType: "module" },
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
      rules: {}
    }, null, 2)
  );

  // prettier config
  fs.writeFileSync(
    path.join(projectPath, ".prettierrc"), 
    JSON.stringify({ semi: true, singleQuote: false }, null, 2)
  );

  // tsconfig.json
  fs.writeFileSync(
    path.join(projectPath, "tsconfig.json"),
    JSON.stringify({
      "compilerOptions": {
        "target": "ES2022",
        "useDefineForClassFields": true,
        "lib": ["ES2022", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src"],
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

  // index.html
  fs.writeFileSync(
    path.join(projectPath, "index.html"),
    `<!DOCTYPE html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`
  );

  // vite config
  fs.writeFileSync(
    path.join(projectPath, "vite.config.ts"),
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });`
  );

  // src/main.tsx — wrap with BrowserRouter and state library provider
  if (stateLibrary === "redux" || stateLibrary === "redux-toolkit-query") {
    // Redux Provider
    fs.writeFileSync(
      path.join(projectPath, "src/main.tsx"),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);`
    );
  } else if (stateLibrary === "recoil") {
    // Recoil Root
    fs.writeFileSync(
      path.join(projectPath, "src/main.tsx"),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);`
    );
  } else if (stateLibrary === "mobx") {
    // MobX Provider
    fs.writeFileSync(
      path.join(projectPath, "src/main.tsx"),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react-lite';
import { counterStore } from './stores';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider counterStore={counterStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);`
    );
  } else {
    // 其他状态库不需要额外的Provider
    fs.writeFileSync(
      path.join(projectPath, "src/main.tsx"),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);`
    );
  }

  // src/App.tsx — router + links
  fs.writeFileSync(
    path.join(projectPath, "src/App.tsx"),
    `import { Routes, Route, Link } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';

export default function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}`
  );

  // src/routes/Home.tsx - 根据状态库类型使用不同的状态管理
  if (stateLibrary === "redux" || stateLibrary === "redux-toolkit-query") {
    // Redux方式
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      `import Hello from '../components/Hello';
import { useAppSelector, useAppDispatch } from '../stores/hooks';
import { increment } from '../stores/counterSlice';
import { useGetPostsQuery } from '../stores/apiSlice';

export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  
  // 如果使用RTK Query，可以展示API数据
  let postsData = null;
  if ("useGetPostsQuery" in window) {
    const { data, error, isLoading } = useGetPostsQuery();
    postsData = (
      <div style={{ marginTop: '1rem' }}>
        <h3>Posts Data:</h3>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading data</p>}
        {data && data.slice(0, 3).map(post => (
          <p key={post.id}>{post.title}</p>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      {postsData}
    </div>
  );
}`
    );
  } else if (stateLibrary === "zustand" || stateLibrary === "none") {
    // Zustand方式
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      `import Hello from '../components/Hello';
import { useCounter } from '../stores/useCounter';

export default function Home() {
  const { count, increment } = useCounter();
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}`
    );
  } else if (stateLibrary === "recoil") {
    // Recoil方式
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      `import Hello from '../components/Hello';
import { useRecoilState } from 'recoil';
import { counterState } from '../stores/atoms';

export default function Home() {
  const [count, setCount] = useRecoilState(counterState);
  const increment = () => setCount(count + 1);
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}`
    );
  } else if (stateLibrary === "jotai") {
    // Jotai方式
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      `import Hello from '../components/Hello';
import { useAtom } from 'jotai';
import { counterAtom } from '../stores/atoms';

export default function Home() {
  const [count, setCount] = useAtom(counterAtom);
  const increment = () => setCount(count + 1);
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}`
    );
  } else if (stateLibrary === "mobx") {
    // MobX方式
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      `import Hello from '../components/Hello';
import { useContext } from 'react';
import { counterStore } from '../stores';
import { observer } from 'mobx-react-lite';

export default observer(function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {counterStore.count}</p>
      <button onClick={() => counterStore.increment()}>+1</button>
    </div>
  );
});`
    );
  } else if (stateLibrary === "valtio") {
    // Valtio方式
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      `import Hello from '../components/Hello';
import { useSnapshot } from 'valtio';
import { store, increment } from '../stores/store';

export default function Home() {
  const snap = useSnapshot(store);
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {snap.count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}`
    );
  } else if (stateLibrary === "nanostores") {
    // Nanostores方式
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      `import Hello from '../components/Hello';
import { useStore } from '@nanostores/react';
import { counter, increment } from '../stores/counter';

export default function Home() {
  const count = useStore(counter);
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}`
    );
  }

  // src/routes/About.tsx
  fs.writeFileSync(
    path.join(projectPath, "src/routes/About.tsx"),
    `export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is an example About page.</p>
    </div>
  );
}`
  );

  // src/components/Hello.tsx
  fs.writeFileSync(
    path.join(projectPath, "src/components/Hello.tsx"),
    `export default function Hello(){ return <p>Hello Component</p>; }`
  );

  // 根据选择的状态库生成相应的store示例
  fs.mkdirSync(path.join(projectPath, "src/stores"), { recursive: true });
  
  if (stateLibrary === "redux" || stateLibrary === "redux-toolkit-query") {
    // Redux store示例
    fs.writeFileSync(
      path.join(projectPath, "src/stores/store.ts"),
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
      path.join(projectPath, "src/stores/counterSlice.ts"),
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
      state.value += 1;
    },
  },
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;`
    );
    
    // 生成hooks.ts便于使用Redux hooks
    fs.writeFileSync(
      path.join(projectPath, "src/stores/hooks.ts"),
      `import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;`
    );
    
    // 如果选择了RTK Query，添加API slice
    if (stateLibrary === "redux-toolkit-query") {
      fs.writeFileSync(
        path.join(projectPath, "src/stores/apiSlice.ts"),
        `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 定义API服务
interface Post {
  id: number;
  title: string;
  body: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
    }),
  }),
});

export const { useGetPostsQuery } = apiSlice;`
      );
      
      // 更新store.ts以包含apiSlice
      fs.writeFileSync(
        path.join(projectPath, "src/stores/store.ts"),
        `import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import { apiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`
      );
    }
  } else if (stateLibrary === "zustand" || stateLibrary === "none") {
    // Zustand store示例
    fs.writeFileSync(
      path.join(projectPath, "src/stores/useCounter.ts"),
      `import { create } from 'zustand';

type CounterState = { count: number; increment: () => void };

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));`
    );
  } else if (stateLibrary === "recoil") {
    // Recoil store示例
    fs.writeFileSync(
      path.join(projectPath, "src/stores/atoms.ts"),
      `import { atom } from 'recoil';

export const counterState = atom({
  key: 'counterState',
  default: 0,
});`
    );
  } else if (stateLibrary === "jotai") {
    // Jotai store示例
    fs.writeFileSync(
      path.join(projectPath, "src/stores/atoms.ts"),
      `import { atom } from 'jotai';

export const counterAtom = atom(0);`
    );
  } else if (stateLibrary === "mobx") {
    // MobX store示例
    fs.writeFileSync(
      path.join(projectPath, "src/stores/CounterStore.ts"),
      `import { makeAutoObservable } from 'mobx';

export class CounterStore {
  count = 0;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  increment() {
    this.count += 1;
  }
}`
    );
    
    fs.writeFileSync(
      path.join(projectPath, "src/stores/index.ts"),
      `import { CounterStore } from './CounterStore';

export const counterStore = new CounterStore();`
    );
  } else if (stateLibrary === "valtio") {
    // Valtio store示例
    fs.writeFileSync(
      path.join(projectPath, "src/stores/store.ts"),
      `import { proxy } from 'valtio';

export const store = proxy({
  count: 0,
});

export const increment = () => {
  store.count += 1;
};`
    );
  } else if (stateLibrary === "nanostores") {
    // Nanostores示例
    fs.writeFileSync(
      path.join(projectPath, "src/stores/counter.ts"),
      `import { atom } from 'nanostores';

export const counter = atom(0);

export function increment() {
  counter.set(counter.get() + 1);
}`
    );
  }

  // 添加 Zod 验证示例代码
  if (validationLibrary === "zod") {
    // 创建 validation 目录
    fs.mkdirSync(path.join(projectPath, "src/validation"), { recursive: true });
    
    // 创建示例验证模式文件
    fs.writeFileSync(
      path.join(projectPath, "src/validation/userSchema.ts"),
      `import { z } from 'zod';

// 用户数据验证模式
export const userSchema = z.object({
  name: z.string().min(2, { message: "姓名至少需要2个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  age: z.number().min(18, { message: "年龄必须大于或等于18岁" }),
});

export type User = z.infer<typeof userSchema>;`
    );
    
    // 修改 Home 组件以使用 Zod 验证
    const originalHomeContent = `import Hello from '../components/Hello';
import { useCounter } from '../stores/useCounter';

import React, { useState } from 'react';
import { userSchema } from '../validation/userSchema';

export default function Home() {
  const { count, increment } = useCounter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 验证表单数据
      userSchema.parse({
        ...formData,
        age: parseInt(formData.age)
      });
      setErrors({});
      alert('表单验证成功!');
    } catch (error: any) {
      // 处理验证错误
      const newErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {count}</p>
      <button onClick={increment}>+1</button>
      
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h2>Zod 表单验证示例</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>姓名:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
            {errors.name && <p style={{ color: 'red', margin: '5px 0 0 70px' }}>{errors.name}</p>}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>邮箱:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
            {errors.email && <p style={{ color: 'red', margin: '5px 0 0 70px' }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>年龄:</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
            {errors.age && <p style={{ color: 'red', margin: '5px 0 0 70px' }}>{errors.age}</p>}
          </div>
          <button type="submit" style={{ padding: '8px 16px' }}>提交</button>
        </form>
      </div>
    </div>
  );
}`;
    
    fs.writeFileSync(
      path.join(projectPath, "src/routes/Home.tsx"),
      originalHomeContent
    );
  }
}