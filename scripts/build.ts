import { buildRouter, copyDtsRouter, initBuildRouter } from "./build_router.ts";
import {
  buildRuntime,
  copyDtsRuntime,
  initBuildRuntime,
} from "./build_runtime.ts";
import { getNames, replaceTs } from "./convert.ts";
import { emptyDir, esbuild, VERSION } from "./deps.ts";

await emptyDir("npm");
await Deno.mkdir("npm/src", { recursive: true });
await initBuildRuntime();
await initBuildRouter();
const srcFiles = await getNames("src");
for (let i = 0; i < srcFiles.length; i++) {
  const path = srcFiles[i];
  if (!path.includes("test")) {
    await replaceTs(path, "npm/" + path);
  }
}

const config: esbuild.BuildOptions = {
  target: ["node12", "es6"],
  platform: "neutral",
};

async function build(config: esbuild.BuildOptions, base: string) {
  await esbuild.build({
    ...config,
    bundle: true,
    entryPoints: ["npm/src/index.ts"],
    outfile: base + "index.js",
  });
}

try {
  await build({ ...config, format: "esm" }, "npm/esm/");
  await build({ ...config, format: "cjs" }, "npm/cjs/");
  await build(
    { ...config, format: "iife", minify: true, globalName: "vanjsx" },
    "npm/browser/",
  );
  await buildRuntime(config);
  await buildRouter(config);
  console.log("success build");
} catch (error) {
  console.log(error);
}
esbuild.stop();

Deno.writeTextFileSync("npm/cjs/package.json", `{"type":"commonjs"}`);
Deno.writeTextFileSync("npm/esm/package.json", `{"type":"module"}`);
await Deno.copyFile("LICENSE", "npm/LICENSE");
await Deno.copyFile("README.md", "npm/README.md");

Deno.writeTextFileSync(
  "npm/package.json",
  JSON.stringify(
    {
      "name": "van-jsx",
      "description":
        "A small 1kb JSX libs for building SSR/UI with vanilla and hooks.",
      "author": "Herudi",
      "version": VERSION,
      "module": "./esm/index.js",
      "main": "./cjs/index.js",
      "unpkg": "./browser/index.js",
      "types": "./types/index.d.ts",
      "license": "MIT",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/herudi/van-jsx.git",
      },
      "bugs": {
        "url": "https://github.com/herudi/van-jsx/issues",
      },
      "engines": {
        "node": ">=12.0.0",
      },
      "keywords": [
        "jsx",
        "small",
        "fast",
        "1kb",
        "no virtual-dom",
        "react",
      ],
      "exports": {
        ".": {
          "types": "./types/index.d.ts",
          "require": "./cjs/index.js",
          "import": "./esm/index.js",
        },
        "./jsx-runtime": {
          "types": "./jsx-runtime/types/index.d.ts",
          "require": "./jsx-runtime/cjs/index.js",
          "import": "./jsx-runtime/esm/index.js",
        },
        "./jsx-dev-runtime": {
          "types": "./jsx-runtime/types/index.d.ts",
          "require": "./jsx-runtime/cjs/index.js",
          "import": "./jsx-runtime/esm/index.js",
        },
      },
      "typesVersions": {
        "*": {
          "*": [
            "./types/index.d.ts",
          ],
          "jsx-runtime": [
            "./jsx-runtime/types/index.d.ts",
          ],
          "jsx-dev-runtime": [
            "./jsx-runtime/types/index.d.ts",
          ],
        },
      },
    },
    null,
    2,
  ),
);

const p = new Deno.Command("tsc", {
  stderr: "null",
  stdout: "null",
});
await p.spawn().status;
await Deno.remove("npm/src", { recursive: true });
await copyDtsRuntime();
await copyDtsRouter();
