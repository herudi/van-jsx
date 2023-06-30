import * as esbuild from "https://deno.land/x/esbuild@v0.18.2/mod.js";
import { emptyDir } from "https://deno.land/std@0.167.0/fs/empty_dir.ts";
import { getNames, replaceTs } from "./convert.ts";

const VERSION = "0.0.6";

await emptyDir("npm");
await Deno.mkdir("npm/src", { recursive: true });
await Deno.mkdir("npm/jsx-runtime/esm", { recursive: true });
await Deno.mkdir("npm/jsx-runtime/cjs", { recursive: true });
await Deno.mkdir("npm/jsx-runtime/types", { recursive: true });
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
  // await esbuild.build({
  //   ...config,
  //   entryPoints: ["npm/src/jsx-runtime.ts"],
  //   outfile: base + "jsx-runtime.js",
  // });
  // await esbuild.build({
  //   ...config,
  //   entryPoints: ["npm/src/jsx-dev-runtime.ts"],
  //   outfile: base + "jsx-dev-runtime.js",
  // });
}
async function buildRuntime(config: esbuild.BuildOptions, base: string) {
  const res = await esbuild.build({
    ...config,
    entryPoints: ["src/jsx-runtime.ts"],
    write: false,
  });
  await Deno.writeTextFile(
    base + "index.js",
    res.outputFiles[0].text.replace("./index.ts", "van-jsx"),
  );
  Deno.writeTextFileSync(base + "package.json", `{"type":"commonjs"}`);
  Deno.writeTextFileSync(base + "package.json", `{"type":"module"}`);
}
try {
  await build({ ...config, format: "esm" }, "npm/esm/");
  await build({ ...config, format: "cjs" }, "npm/cjs/");
  await build(
    { ...config, format: "iife", minify: true, globalName: "vanjsx" },
    "npm/browser/",
  );
  await buildRuntime({ ...config, format: "esm" }, "npm/jsx-runtime/esm/");
  await buildRuntime({ ...config, format: "cjs" }, "npm/jsx-runtime/cjs/");

  Deno.writeTextFileSync(
    "npm/jsx-runtime/package.json",
    JSON.stringify(
      {
        "name": "jsx-runtime",
        "description": "",
        "author": "Herudi",
        "private": true,
        "version": VERSION,
        "module": "./esm/index.js",
        "main": "./cjs/index.js",
        "types": "./types/index.d.ts",
        "peerDependencies": {
          "van-jsx": "^" + VERSION,
        },
        "license": "MIT",
        "keywords": [],
        "exports": {
          ".": {
            "types": "./types/index.d.ts",
            "require": "./cjs/index.js",
            "import": "./esm/index.js",
          },
        },
      },
      null,
      2,
    ),
  );
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
const file = await Deno.readTextFile("npm/types/jsx-runtime.d.ts");
await Deno.writeTextFile(
  "npm/jsx-runtime/types/index.d.ts",
  file.replace("./index", "van-jsx"),
);
await Deno.remove("npm/types/jsx-runtime.d.ts");
