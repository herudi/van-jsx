import { esbuild, VERSION } from "./deps.ts";

export async function initBuildRuntime() {
  await Deno.mkdir("npm/jsx-runtime/esm", { recursive: true });
  await Deno.mkdir("npm/jsx-runtime/cjs", { recursive: true });
  await Deno.mkdir("npm/jsx-runtime/types", { recursive: true });
}
export async function build(config: esbuild.BuildOptions, base: string) {
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
export async function buildRuntime(config: esbuild.BuildOptions) {
  await build({ ...config, format: "esm" }, "npm/jsx-runtime/esm/");
  await build({ ...config, format: "cjs" }, "npm/jsx-runtime/cjs/");

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
}

export async function copyDtsRuntime() {
  const file = await Deno.readTextFile("npm/types/jsx-runtime.d.ts");
  await Deno.writeTextFile(
    "npm/jsx-runtime/types/index.d.ts",
    file.replace("./index", "van-jsx"),
  );
  await Deno.remove("npm/types/jsx-runtime.d.ts");
}
