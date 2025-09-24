import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
    plugins: [
        react(),
        // 👇 force Rollup to convert require()/module.exports in our generated files
        commonjs({
            include: [/node_modules/, /src\/grpc\/.*/],
        }),
    ],
    optimizeDeps: {
        // make sure esbuild pre-bundles these so imports resolve cleanly
        include: [
            "google-protobuf",
            "grpc-web",
            // include our generated files so dev/build both see them as deps
            "/src/grpc/ping_pb.js",
            "/src/grpc/ping_grpc_web_pb.js",
        ],
    },
});