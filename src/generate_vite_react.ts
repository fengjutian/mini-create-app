import fs from "fs";
import path from "path";
import { type ValidationLibrary } from "./types.ts";
export function generateViteReact(projectPath: string, validationLibrary: ValidationLibrary) {
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
      zustand: "^4.1.0",
      ...(validationLibrary === "zod" ? { "zod": "^3.22.0" } : {}),
      ...(validationLibrary === "yup" ? { "yup": "^1.2.0" } : {}),
      ...(validationLibrary === "io-ts" ? { "io-ts": "^2.2.20" } : {}),
      ...(validationLibrary === "superstruct" ? { "superstruct": "^1.0.3" } : {}),
      ...(validationLibrary === "valibot" ? { "valibot": "^0.28.0" } : {}),
      ...(validationLibrary === "runtypes" ? { "runtypes": "^6.7.0" } : {})
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
      "@types/react-router-dom": "^5.3.3"
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

  // src/main.tsx — wrap with BrowserRouter
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

  // src/routes/Home.tsx
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

  // src/stores/useCounter.ts — zustand store
  fs.writeFileSync(
    path.join(projectPath, "src/stores/useCounter.ts"),
    `import { create } from 'zustand';

type CounterState = { count: number; increment: () => void };

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));`
  );

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