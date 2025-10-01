import fs from "node:fs";
import path from "node:path";
import { type ErrorHandlingLibrary, type TestingLibrary, type StateLibrary } from "./types.ts";

export function generateFresh(projectPath: string, errorHandlingLibrary: ErrorHandlingLibrary, testingLibrary: TestingLibrary, stateLibrary: StateLibrary) {
  fs.mkdirSync(path.join(projectPath, "routes"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "islands"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "components"), { recursive: true });
  const imports: Record<string, string> = {};
    if (errorHandlingLibrary === "neverthrow") {
      imports["neverthrow/"] = "https://deno.land/x/neverthrow@v6.0.0/";
    } else if (errorHandlingLibrary === "fp-ts") {
      imports["fp-ts/"] = "https://deno.land/x/fp_ts@v2.16.0/";
    }
    
    if (testingLibrary === "jest") {
      imports["@testing-library/react/"] = "https://deno.land/x/testing_library_react@v14.0.0/";
    }
    
    // 添加状态库依赖
    if (stateLibrary === "redux") {
      imports["redux/"] = "https://esm.sh/redux@5.0.1";
      imports["react-redux/"] = "https://esm.sh/react-redux@9.0.4";
      imports["@reduxjs/toolkit/"] = "https://esm.sh/@reduxjs/toolkit@2.0.1";
    } else if (stateLibrary === "zustand") {
      imports["zustand/"] = "https://esm.sh/zustand@4.4.7";
    } else if (stateLibrary === "nanostores") {
      imports["nanostores/"] = "https://esm.sh/nanostores@0.9.5";
      imports["@nanostores/preact/"] = "https://esm.sh/@nanostores/preact@0.4.1";
    }
    
    fs.writeFileSync(
      path.join(projectPath, "deno.json"),
      JSON.stringify(
        { 
          tasks: { start: "deno run -A dev.ts", test: "deno test" },
          imports: Object.keys(imports).length > 0 ? imports : undefined
        },
        null,
        2
      )
    );
  
  fs.writeFileSync(path.join(projectPath, "dev.ts"), `import dev from "$fresh/dev.ts"; import config from "./fresh.config.ts"; await dev(import.meta.url, './main.ts', config);`);
  fs.writeFileSync(path.join(projectPath, "main.ts"), `import { start } from "$fresh/server.ts"; import manifest from "./fresh.gen.ts"; start(manifest);`);
  fs.writeFileSync(path.join(projectPath, "fresh.config.ts"), `export default {};`);
  
  // 创建stores目录
  fs.mkdirSync(path.join(projectPath, "stores"), { recursive: true });
  
  // 根据状态库类型生成相应的状态管理代码
  if (stateLibrary === "redux") {
    // Redux配置
    fs.writeFileSync(
      path.join(projectPath, "stores/store.ts"),
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
      path.join(projectPath, "stores/counterSlice.ts"),
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
    
    fs.writeFileSync(
      path.join(projectPath, "stores/hooks.ts"),
      `import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;`
    );
    
    // Redux版本的Counter组件
    fs.writeFileSync(
      path.join(projectPath, "islands/Counter.tsx"),
      `import { useAppSelector, useAppDispatch } from '../stores/hooks';
import { increment } from '../stores/counterSlice';

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  
  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  );
}`
    );
  } else if (stateLibrary === "zustand") {
    // Zustand配置
    fs.writeFileSync(
      path.join(projectPath, "stores/useCounter.ts"),
      `import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
}

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));`
    );
    
    // Zustand版本的Counter组件
    fs.writeFileSync(
      path.join(projectPath, "islands/Counter.tsx"),
      `import { useCounter } from '../stores/useCounter';

export default function Counter() {
  const { count, increment } = useCounter();
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}`
    );
  } else if (stateLibrary === "nanostores") {
    // Nanostores配置
    fs.writeFileSync(
      path.join(projectPath, "stores/counter.ts"),
      `import { atom } from 'nanostores';

export const counter = atom(0);

export function increment() {
  counter.set(counter.get() + 1);
}`
    );
    
    // Nanostores版本的Counter组件
    fs.writeFileSync(
      path.join(projectPath, "islands/Counter.tsx"),
      `import { counter, increment } from '../stores/counter';
import { useStore } from '@nanostores/preact';

export default function Counter() {
  const count = useStore(counter);
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}`
    );
  }
  
  // 生成其他基础文件
  fs.writeFileSync(path.join(projectPath, "routes/index.tsx"), `import Header from '../components/Header.tsx'; import Footer from '../components/Footer.tsx'; import Counter from '../islands/Counter.tsx'; export default function Home(){ return (<div><Header /><h1>Fresh + React</h1><Counter /><Footer /></div>); }`);
  fs.writeFileSync(path.join(projectPath, "components/Header.tsx"), `export default function Header(){ return <header><h2>Header</h2></header>; }`);
  fs.writeFileSync(path.join(projectPath, "components/Footer.tsx"), `export default function Footer(){ return <footer><p>Footer</p></footer>; }`);
  
  // 如果没有选择状态库，使用默认的Counter组件
  if (!stateLibrary || stateLibrary === "none") {
    fs.writeFileSync(path.join(projectPath, "islands/Counter.tsx"), `import { useState } from 'preact/hooks'; export default function Counter(){ const [c,set]=useState(0); return <button onClick={()=>set(c+1)}>Count: {c}</button>; }`);
  }
}