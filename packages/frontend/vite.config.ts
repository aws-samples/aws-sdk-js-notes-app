import { defineConfig, loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default ({mode}) => {
  console.log(process.env.VITE_BASE_URL)
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [reactRefresh()],
    base: process.env.VITE_BASE_URL,
    resolve: {
      alias: {
        "./runtimeConfig": "./runtimeConfig.browser",
      },
    },
  });
}
