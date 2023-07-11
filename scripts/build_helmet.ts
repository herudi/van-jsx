import { esbuild, VERSION } from "./deps.ts";

export async function initBuildHelmet() {
  await Deno.mkdir("npm/helmet/esm", { recursive: true });
  await Deno.mkdir("npm/helmet/cjs", { recursive: true });
  await Deno.mkdir("npm/helmet/types", { recursive: true });
}
export async function build(config: esbuild.BuildOptions, base: string) {
  const res = await esbuild.build({
    ...config,
    entryPoints: ["src/helmet.ts"],
    write: false,
  });
  await Deno.writeTextFile(
    base + "index.js",
    res.outputFiles[0].text.replace("./index.ts", "van-jsx"),
  );
  Deno.writeTextFileSync(base + "package.json", `{"type":"commonjs"}`);
  Deno.writeTextFileSync(base + "package.json", `{"type":"module"}`);
}
export async function buildHelmet(config: esbuild.BuildOptions) {
  await build({ ...config, format: "esm" }, "npm/helmet/esm/");
  await build({ ...config, format: "cjs" }, "npm/helmet/cjs/");

  Deno.writeTextFileSync(
    "npm/helmet/package.json",
    JSON.stringify(
      {
        "name": "helmet",
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

export async function copyDtsHelmet() {
  const file = await Deno.readTextFile("npm/types/helmet.d.ts");
  await Deno.writeTextFile(
    "npm/helmet/types/index.d.ts",
    file.replace("./index", "van-jsx"),
  );
  await Deno.remove("npm/types/helmet.d.ts");
}
