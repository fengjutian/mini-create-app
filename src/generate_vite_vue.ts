import fs from "fs";
import path from "path";
import { type ValidationLibrary, type ErrorHandlingLibrary } from "./types.ts";

export function generateViteVue(projectPath: string, validationLibrary: ValidationLibrary, errorHandlingLibrary: ErrorHandlingLibrary) {
  fs.mkdirSync(path.join(projectPath, "src/components"), { recursive: true });
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(
      {
        name: "vite-vue-app",
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
          typecheck: "vue-tsc --noEmit" // 添加类型检查脚本
        },
        dependencies: {
            vue: "^3.2.0",
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
            ...(errorHandlingLibrary === "fp-ts" ? { "fp-ts": "^2.16.0" } : {})
          },
        devDependencies: {
          vite: "^4.0.0",
          typescript: "^5.0.0",
          "@vitejs/plugin-vue": "^4.0.0",
          "vue-tsc": "^1.0.0"
        },
      },
      null,
      2
    )
  );
  
  // tsconfig.json
  fs.writeFileSync(
    path.join(projectPath, "tsconfig.json"),
    JSON.stringify({
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "preserve",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
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

  fs.writeFileSync(
    path.join(projectPath, "index.html"),
    `<!DOCTYPE html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`
  );
  fs.writeFileSync(
    path.join(projectPath, "vite.config.ts"),
    `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({ plugins: [vue()] });`
  );
  fs.writeFileSync(
    path.join(projectPath, "src/main.ts"),
    `import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');`
  );
  fs.writeFileSync(
    path.join(projectPath, "src/App.vue"),
    `<template><h1>Vue + Vite + TS</h1><HelloWorld msg="Hello Vue!"/></template><script setup lang="ts">import HelloWorld from './components/HelloWorld.vue'</script>`
  );
  fs.writeFileSync(
    path.join(projectPath, "src/components/HelloWorld.vue"),
    `<template><p>{{ msg }}</p></template><script setup lang="ts">defineProps<{ msg: string }>();</script>`
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
    
    // 修改 App.vue 以使用 Zod 验证
    fs.writeFileSync(
      path.join(projectPath, "src/App.vue"),
      `<template>
  <div>
    <h1>Vue + Vite + TS</h1>
    <HelloWorld msg="Hello Vue!"/>
    
    <div style="marginTop: '20px', padding: '10px', border: '1px solid #ddd'">
      <h2>Zod 表单验证示例</h2>
      <form @submit.prevent="handleSubmit">
        <div style="marginBottom: '10px'">
          <label>姓名:</label>
          <input
            type="text"
            v-model="formData.name"
            style="marginLeft: '10px', padding: '5px'"
          />
          <p v-if="errors.name" style="color: 'red', margin: '5px 0 0 70px'">{{ errors.name }}</p>
        </div>
        <div style="marginBottom: '10px'">
          <label>邮箱:</label>
          <input
            type="email"
            v-model="formData.email"
            style="marginLeft: '10px', padding: '5px'"
          />
          <p v-if="errors.email" style="color: 'red', margin: '5px 0 0 70px'">{{ errors.email }}</p>
        </div>
        <div style="marginBottom: '10px'">
          <label>年龄:</label>
          <input
            type="number"
            v-model="formData.age"
            style="marginLeft: '10px', padding: '5px'"
          />
          <p v-if="errors.age" style="color: 'red', margin: '5px 0 0 70px'">{{ errors.age }}</p>
        </div>
        <button type="submit" style="padding: '8px 16px'">提交</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
import { userSchema } from './validation/userSchema'

// 表单数据
const formData = ref({
  name: '',
  email: '',
  age: ''
})

// 错误信息
const errors = ref<Record<string, string>>({})

// 提交处理
const handleSubmit = () => {
  try {
    // 验证表单数据
    userSchema.parse({
      ...formData.value,
      age: parseInt(formData.value.age)
    })
    errors.value = {}
    alert('表单验证成功!')
  } catch (error: any) {
    // 处理验证错误
    const newErrors: Record<string, string> = {}
    if (error.errors) {
      error.errors.forEach((err: any) => {
        newErrors[err.path[0]] = err.message
      })
    }
    errors.value = newErrors
  }
}
</script>`
    );
  }
}