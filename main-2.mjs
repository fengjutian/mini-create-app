function generateViteReact(projectPath) {
  // create folders
  fs.mkdirSync(projectPath + "/src/components", { recursive: true });
  fs.mkdirSync(projectPath + "/src/routes", { recursive: true });
  fs.mkdirSync(projectPath + "/src/stores", { recursive: true });

  // package.json: include react-router-dom and zustand + eslint/prettier devDeps
  const pkg = {
    name: "vite-react-app",
    private: true,
    scripts: { dev: "vite", build: "vite build", preview: "vite preview", lint: "eslint src --ext .ts,.tsx" },
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
      "eslint-config-prettier": "^8.8.0"
    }
  };
  fs.writeFileSync(projectPath + "/package.json", JSON.stringify(pkg, null, 2));

  // eslint config
  fs.writeFileSync(
    projectPath + "/.eslintrc.json",
    JSON.stringify({
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaVersion: 2020, sourceType: "module" },
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
      rules: {}
    }, null, 2)
  );

  // prettier config
  fs.writeFileSync(projectPath + "/.prettierrc", JSON.stringify({ semi: true, singleQuote: false }, null, 2));

  // index.html
  fs.writeFileSync(
    projectPath + "/index.html",
    `<!DOCTYPE html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`
  );

  // vite config
  fs.writeFileSync(
    projectPath + "/vite.config.ts",
    `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });`
  );

  // src/main.tsx — wrap with BrowserRouter
  fs.writeFileSync(
    projectPath + "/src/main.tsx",
    `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport { BrowserRouter } from 'react-router-dom';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <BrowserRouter>\n      <App />\n    </BrowserRouter>\n  </React.StrictMode>\n);`
  );

  // src/App.tsx — router + links
  fs.writeFileSync(
    projectPath + "/src/App.tsx",
    `import { Routes, Route, Link } from 'react-router-dom';\nimport Home from './routes/Home';\nimport About from './routes/About';\n\nexport default function App() {\n  return (\n    <div>\n      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>\n        <Link to=\"/\">Home</Link>\n        <Link to=\"/about\">About</Link>\n      </nav>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/about\" element={<About />} />\n      </Routes>\n    </div>\n  );\n}`
  );

  // src/routes/Home.tsx
  fs.writeFileSync(
    projectPath + "/src/routes/Home.tsx",
    `import Hello from '../components/Hello';\nimport { useCounter } from '../stores/useCounter';\n\nexport default function Home() {\n  const { count, increment } = useCounter();\n  return (\n    <div>\n      <h1>Home Page</h1>\n      <Hello />\n      <p>Counter: {count}</p>\n      <button onClick={increment}>+1</button>\n    </div>\n  );\n}`
  );

  // src/routes/About.tsx
  fs.writeFileSync(
    projectPath + "/src/routes/About.tsx",
    `export default function About() {\n  return (\n    <div>\n      <h1>About Page</h1>\n      <p>This is an example About page.</p>\n    </div>\n  );\n}`
  );

  // src/components/Hello.tsx
  fs.writeFileSync(
    projectPath + "/src/components/Hello.tsx",
    `export default function Hello(){ return <p>Hello Component</p>; }`
  );

  // src/stores/useCounter.ts — zustand store
  fs.writeFileSync(
    projectPath + "/src/stores/useCounter.ts",
    `import create from 'zustand';\n\ntype CounterState = { count: number; increment: () => void };\n\nexport const useCounter = create<CounterState>((set) => ({\n  count: 0,\n  increment: () => set((s) => ({ count: s.count + 1 })),\n}));`
  );
}
