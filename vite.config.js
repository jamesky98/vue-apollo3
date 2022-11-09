import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'


// expressWinston 日誌可由此中間件建立

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  // console.log("mode",mode);
  // console.log("env",env);

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: { "process.env": {} },
    server: {
      host: "0.0.0.0",
      // host: "host.docker.internal",
    },
  }
});
