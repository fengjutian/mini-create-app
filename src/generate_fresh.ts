import fs from "fs";
import path from "path";

export function generateFresh(projectPath: string) {
  fs.mkdirSync(path.join(projectPath, "routes"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "islands"), { recursive: true });
  fs.mkdirSync(path.join(projectPath, "components"), { recursive: true });
  fs.writeFileSync(
    path.join(projectPath, "deno.json"),
    JSON.stringify(
      { tasks: { start: "deno run -A dev.ts" } },
      null,
      2
    )
  );
  fs.writeFileSync(path.join(projectPath, "dev.ts"), `import dev from "$fresh/dev.ts"; import config from "./fresh.config.ts"; await dev(import.meta.url, './main.ts', config);`);
  fs.writeFileSync(path.join(projectPath, "main.ts"), `import { start } from "$fresh/server.ts"; import manifest from "./fresh.gen.ts"; start(manifest);`);
  fs.writeFileSync(path.join(projectPath, "fresh.config.ts"), `export default {};`);
  fs.writeFileSync(path.join(projectPath, "routes/index.tsx"), `import Header from '../components/Header.tsx'; import Footer from '../components/Footer.tsx'; import Counter from '../islands/Counter.tsx'; export default function Home(){ return (<div><Header /><h1>Fresh + React</h1><Counter /><Footer /></div>); }`);
  fs.writeFileSync(path.join(projectPath, "components/Header.tsx"), `export default function Header(){ return <header><h2>Header</h2></header>; }`);
  fs.writeFileSync(path.join(projectPath, "components/Footer.tsx"), `export default function Footer(){ return <footer><p>Footer</p></footer>; }`);
  fs.writeFileSync(path.join(projectPath, "islands/Counter.tsx"), `import { useState } from 'preact/hooks'; export default function Counter(){ const [c,set]=useState(0); return <button onClick={()=>set(c+1)}>Count: {c}</button>; }`);
}