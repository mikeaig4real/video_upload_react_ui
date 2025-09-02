import { defineConfig } from "vite";
import path from "path";

export default defineConfig( {
    server: {
        port: 5174,
        strictPort: true,
    },
    resolve: {
        alias: {
            "@shared": path.resolve( __dirname, "./../../shared" ),
        },
    },
} );
