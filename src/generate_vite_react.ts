import fs from "fs";
import path from "path";
export function generateViteReact(projectPath: string) {
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
      zustand: "^4.1.0"
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
}