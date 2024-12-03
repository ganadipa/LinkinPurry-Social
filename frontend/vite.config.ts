import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
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
            process.env.ENVIRONMENT === "dev"
              ? "http://be-dev:8000"
              : "http://localhost:8000",
          changeOrigin: true,
        },
        "/ws": {
          target:
            env.ENVIRONMENT === "dev"
              ? "http://be-dev:8000"
              : "http://localhost:8000",
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          'service-worker': path.resolve(__dirname, 'public/service-worker.ts'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'service-worker' 
              ? '[name].js'
              : 'assets/js/[name]-[hash].js';
          },
        },
      },
      outDir: 'dist',
      assetsDir: 'assets',
    },
    worker: {
      format: 'es',
      plugins: [],
    },
  };
});
