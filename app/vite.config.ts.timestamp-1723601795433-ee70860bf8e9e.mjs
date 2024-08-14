// vite.config.ts
import react from "file:///C:/Users/ilyes/Documents/Work/Apps/PeekFi/.yarn/__virtual__/@vitejs-plugin-react-virtual-d834ac7983/5/AppData/Local/Yarn/Berry/cache/@vitejs-plugin-react-npm-4.2.1-8b9705c544-10c0.zip/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { URL, fileURLToPath } from "node:url";
import { loadEnv } from "file:///C:/Users/ilyes/Documents/Work/Apps/PeekFi/.yarn/__virtual__/vite-virtual-797bff1acb/5/AppData/Local/Yarn/Berry/cache/vite-npm-5.1.2-b48a600f22-10c0.zip/node_modules/vite/dist/node/index.js";
import { defineProject } from "file:///C:/Users/ilyes/Documents/Work/Apps/PeekFi/.yarn/__virtual__/vitest-virtual-39d6d54b19/5/AppData/Local/Yarn/Berry/cache/vitest-npm-1.2.2-fe6dae0383-10c0.zip/node_modules/vitest/dist/config.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/ilyes/Documents/Work/Apps/PeekFi/app/vite.config.ts";
var publicEnvVars = [
  "APP_ENV",
  "APP_NAME",
  "APP_ORIGIN",
  "GOOGLE_CLOUD_PROJECT",
  "FIREBASE_APP_ID",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "GA_MEASUREMENT_ID"
];
var vite_config_default = defineProject(async ({ mode }) => {
  const envDir = fileURLToPath(new URL("..", __vite_injected_original_import_meta_url));
  const env = loadEnv(mode, envDir, "");
  publicEnvVars.forEach((key) => {
    if (!env[key])
      throw new Error(`Missing environment variable: ${key}`);
    process.env[`VITE_${key}`] = env[key];
  });
  return {
    cacheDir: fileURLToPath(new URL("../.cache/vite-app", __vite_injected_original_import_meta_url)),
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ["firebase/analytics", "firebase/app", "firebase/auth"],
            react: ["react", "react-dom", "react-router-dom"]
          }
        }
      }
    },
    plugins: [
      // The default Vite plugin for React projects
      // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"]
        }
      })
    ],
    server: {
      proxy: {
        "/api": {
          target: process.env.LOCAL_API_ORIGIN ?? process.env.API_ORIGIN,
          changeOrigin: true
        }
      }
    },
    test: {
      ...{ cache: { dir: "../.cache/vitest" } },
      environment: "happy-dom"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxpbHllc1xcXFxEb2N1bWVudHNcXFxcV29ya1xcXFxBcHBzXFxcXFBlZWtGaVxcXFxhcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGlseWVzXFxcXERvY3VtZW50c1xcXFxXb3JrXFxcXEFwcHNcXFxcUGVla0ZpXFxcXGFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvaWx5ZXMvRG9jdW1lbnRzL1dvcmsvQXBwcy9QZWVrRmkvYXBwL3ZpdGUuY29uZmlnLnRzXCI7LyogU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAxNC1wcmVzZW50IEtyaWFzb2Z0ICovXG4vKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogTUlUICovXG5cbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IFVSTCwgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJub2RlOnVybFwiO1xuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBkZWZpbmVQcm9qZWN0IH0gZnJvbSBcInZpdGVzdC9jb25maWdcIjtcblxuY29uc3QgcHVibGljRW52VmFycyA9IFtcbiAgXCJBUFBfRU5WXCIsXG4gIFwiQVBQX05BTUVcIixcbiAgXCJBUFBfT1JJR0lOXCIsXG4gIFwiR09PR0xFX0NMT1VEX1BST0pFQ1RcIixcbiAgXCJGSVJFQkFTRV9BUFBfSURcIixcbiAgXCJGSVJFQkFTRV9BUElfS0VZXCIsXG4gIFwiRklSRUJBU0VfQVVUSF9ET01BSU5cIixcbiAgXCJHQV9NRUFTVVJFTUVOVF9JRFwiLFxuXTtcblxuLyoqXG4gKiBWaXRlIGNvbmZpZ3VyYXRpb24uXG4gKiBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVQcm9qZWN0KGFzeW5jICh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnZEaXIgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuLlwiLCBpbXBvcnQubWV0YS51cmwpKTtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBlbnZEaXIsIFwiXCIpO1xuXG4gIHB1YmxpY0VudlZhcnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKCFlbnZba2V5XSkgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGVudmlyb25tZW50IHZhcmlhYmxlOiAke2tleX1gKTtcbiAgICBwcm9jZXNzLmVudltgVklURV8ke2tleX1gXSA9IGVudltrZXldO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGNhY2hlRGlyOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuLi8uY2FjaGUvdml0ZS1hcHBcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG5cbiAgICBidWlsZDoge1xuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgIGZpcmViYXNlOiBbXCJmaXJlYmFzZS9hbmFseXRpY3NcIiwgXCJmaXJlYmFzZS9hcHBcIiwgXCJmaXJlYmFzZS9hdXRoXCJdLFxuICAgICAgICAgICAgcmVhY3Q6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwicmVhY3Qtcm91dGVyLWRvbVwiXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gVGhlIGRlZmF1bHQgVml0ZSBwbHVnaW4gZm9yIFJlYWN0IHByb2plY3RzXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUtcGx1Z2luLXJlYWN0L2Jsb2IvbWFpbi9wYWNrYWdlcy9wbHVnaW4tcmVhY3QvUkVBRE1FLm1kXG4gICAgICByZWFjdCh7XG4gICAgICAgIGpzeEltcG9ydFNvdXJjZTogXCJAZW1vdGlvbi9yZWFjdFwiLFxuICAgICAgICBiYWJlbDoge1xuICAgICAgICAgIHBsdWdpbnM6IFtcIkBlbW90aW9uL2JhYmVsLXBsdWdpblwiXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIF0sXG5cbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5MT0NBTF9BUElfT1JJR0lOID8/IHByb2Nlc3MuZW52LkFQSV9PUklHSU4sXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgdGVzdDoge1xuICAgICAgLi4ueyBjYWNoZTogeyBkaXI6IFwiLi4vLmNhY2hlL3ZpdGVzdFwiIH0gfSxcbiAgICAgIGVudmlyb25tZW50OiBcImhhcHB5LWRvbVwiLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFHQSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxLQUFLLHFCQUFxQjtBQUNuQyxTQUFTLGVBQWU7QUFDeEIsU0FBUyxxQkFBcUI7QUFObUwsSUFBTSwyQ0FBMkM7QUFRbFEsSUFBTSxnQkFBZ0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQU1BLElBQU8sc0JBQVEsY0FBYyxPQUFPLEVBQUUsS0FBSyxNQUFNO0FBQy9DLFFBQU0sU0FBUyxjQUFjLElBQUksSUFBSSxNQUFNLHdDQUFlLENBQUM7QUFDM0QsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLEVBQUU7QUFFcEMsZ0JBQWMsUUFBUSxDQUFDLFFBQVE7QUFDN0IsUUFBSSxDQUFDLElBQUksR0FBRztBQUFHLFlBQU0sSUFBSSxNQUFNLGlDQUFpQyxHQUFHLEVBQUU7QUFDckUsWUFBUSxJQUFJLFFBQVEsR0FBRyxFQUFFLElBQUksSUFBSSxHQUFHO0FBQUEsRUFDdEMsQ0FBQztBQUVELFNBQU87QUFBQSxJQUNMLFVBQVUsY0FBYyxJQUFJLElBQUksc0JBQXNCLHdDQUFlLENBQUM7QUFBQSxJQUV0RSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUEsWUFDWixVQUFVLENBQUMsc0JBQXNCLGdCQUFnQixlQUFlO0FBQUEsWUFDaEUsT0FBTyxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxVQUNsRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUztBQUFBO0FBQUE7QUFBQSxNQUdQLE1BQU07QUFBQSxRQUNKLGlCQUFpQjtBQUFBLFFBQ2pCLE9BQU87QUFBQSxVQUNMLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxRQUNuQztBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVEsUUFBUSxJQUFJLG9CQUFvQixRQUFRLElBQUk7QUFBQSxVQUNwRCxjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBTTtBQUFBLE1BQ0osR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLG1CQUFtQixFQUFFO0FBQUEsTUFDeEMsYUFBYTtBQUFBLElBQ2Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
