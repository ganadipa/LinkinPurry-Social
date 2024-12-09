import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  console.log("Loaded environment variables:", process.env);
  // only get the prefix REACT_
  Object.keys(env).forEach((key) => {
    if (!key.startsWith("REACT_")) {
      delete env[key];
    }
  });

  return {
    define: {
      "process.env": env,
    },
    plugins: [react(), TanStackRouterVite()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target:
            process.env.REACT_ENVIRONMENT === "dev"
              ? "http://be-dev:3000"
              : "http://localhost:3000",
          changeOrigin: true,
        },
        "/ws": {
          target:
            env.REACT_ENVIRONMENT === "dev"
              ? "http://be-dev:3000"
              : "http://localhost:3000",
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path,
        },
        "/uploads": {
          target:
            process.env.REACT_ENVIRONMENT === "dev"
              ? "http://be-dev:3000"
              : "http://localhost:3000",
          changeOrigin: true,
        },
      },
      outDir: "dist",
      assetsDir: "assets",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
