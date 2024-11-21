import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  target: "node16",
  format: ["esm"],
  sourcemap: true,
  clean: true,
  minify: false,
  dts: true
});
