import fs from "fs";
import path from "path";
import { type ErrorHandlingLibrary } from "./types.ts";

export function generateVueCDN(projectPath: string, errorHandlingLibrary: ErrorHandlingLibrary) {
  fs.mkdirSync(path.join(projectPath, "public"), { recursive: true });
  fs.writeFileSync(
    path.join(projectPath, "public/index.html"),
    `<!DOCTYPE html><html><head><script src="https://unpkg.com/vue@3/dist/vue.global.js"></script><script type="module" src="./HelloWorld.js"></script></head><body><div id="app"></div><script>const { createApp } = Vue; createApp({ components: { HelloWorld } }).mount('#app');</script></body></html>`
  );
  fs.writeFileSync(
    path.join(projectPath, "public/HelloWorld.js"),
    `export const HelloWorld = { props: ['msg'], template: '<h1>{{ msg }}</h1>' };`
  );
    const imports: Record<string, string> = {};
    if (errorHandlingLibrary === "neverthrow") {
      imports["neverthrow/"] = "https://deno.land/x/neverthrow@v6.0.0/";
    } else if (errorHandlingLibrary === "fp-ts") {
      imports["fp-ts/"] = "https://deno.land/x/fp_ts@v2.16.0/";
    }
    
    fs.writeFileSync(
      path.join(projectPath, "deno.json"),
      JSON.stringify(
        { 
          tasks: { start: "deno run --allow-net --allow-read public/index.html" },
          imports: Object.keys(imports).length > 0 ? imports : undefined
        },
        null,
        2
      )
    );
}