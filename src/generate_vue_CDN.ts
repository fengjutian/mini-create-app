import fs from "fs";
import path from "path";

export function generateVueCDN(projectPath: string) {
  fs.mkdirSync(path.join(projectPath, "public"), { recursive: true });
  fs.writeFileSync(
    path.join(projectPath, "public/index.html"),
    `<!DOCTYPE html><html><head><script src="https://unpkg.com/vue@3/dist/vue.global.js"></script><script type="module" src="./HelloWorld.js"></script></head><body><div id="app"></div><script>const { createApp } = Vue; createApp({ components: { HelloWorld } }).mount('#app');</script></body></html>`
  );
  fs.writeFileSync(
    path.join(projectPath, "public/HelloWorld.js"),
    `export const HelloWorld = { props: ['msg'], template: '<h1>{{ msg }}</h1>' };`
  );
  fs.writeFileSync(
    path.join(projectPath, "deno.json"),
    JSON.stringify(
      { tasks: { start: "deno run --allow-net --allow-read public/index.html" } },
      null,
      2
    )
  );
}