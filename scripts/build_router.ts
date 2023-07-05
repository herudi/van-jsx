import { esbuild, VERSION } from "./deps.ts";

export async function initBuildRouter() {
  await Deno.mkdir("npm/router/esm", { recursive: true });
  await Deno.mkdir("npm/router/cjs", { recursive: true });
  await Deno.mkdir("npm/router/types", { recursive: true });
}
export async function build(config: esbuild.BuildOptions, base: string) {
  const res = await esbuild.build({
    ...config,
    entryPoints: ["src/router.ts"],
    write: false,
  });
  await Deno.writeTextFile(
    base + "index.js",
    res.outputFiles[0].text.replace("./index.ts", "van-jsx"),
  );
  Deno.writeTextFileSync(base + "package.json", `{"type":"commonjs"}`);
  Deno.writeTextFileSync(base + "package.json", `{"type":"module"}`);
}
export async function buildRouter(config: esbuild.BuildOptions) {
  await build({ ...config, format: "esm" }, "npm/router/esm/");
  await build({ ...config, format: "cjs" }, "npm/router/cjs/");

  Deno.writeTextFileSync(
    "npm/router/package.json",
    JSON.stringify(
      {
        "name": "router",
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

export async function copyDtsRouter() {
  const file = await Deno.readTextFile("npm/types/router.d.ts");
  await Deno.writeTextFile(
    "npm/router/types/index.d.ts",
    file.replace("./index", "van-jsx"),
  );
  await Deno.remove("npm/types/router.d.ts");
}
