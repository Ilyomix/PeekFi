/**
 * Vite configuration.
 * https://vitejs.dev/config/
 */
declare const _default: ({ mode }: import("vite").ConfigEnv) => Promise<{
    cacheDir: string;
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    firebase: string[];
                    react: string[];
                };
            };
        };
    };
    plugins: import("vite").PluginOption[][];
    server: {
        proxy: {
            "/api": {
                target: string | undefined;
                changeOrigin: true;
            };
        };
    };
    test: {
        environment: "happy-dom";
        cache: {
            dir: string;
        };
    };
}>;
export default _default;
