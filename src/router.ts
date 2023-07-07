import {
  FC,
  h,
  HTMLAttributes,
  IS_BROWSER,
  render,
  resetId,
  use,
} from "./index.ts";

// deno-lint-ignore no-explicit-any
type TRet = any;
type TObject = { [k: string]: TRet };
export type RouteProps = {
  pathname: string;
  path: string | RegExp;
  params: TObject;
  go: (pathname: string) => void;
};
export type TRouter = {
  path: string;
  component: (route: RouteProps) => JSX.Element;
  pattern: RegExp;
};
export type RouterOptions = {
  hash?: boolean;
  ssr_path?: string;
  redirect?: string;
  name?: string;
};
const removeHash = (path: string) => path[0] === "#" ? path.substring(1) : path;
const getPathname = (pathname: string, hash: string) => {
  if (hash) {
    if (pathname[pathname.length - 1] === "/") {
      pathname = pathname.slice(0, -1);
    }
    pathname = (pathname === "/" ? "/" : pathname + "/") +
      hash.substring(2);
  }
  return pathname;
};
const createPattern = (path: string) => {
  return new RegExp(`^${
    path
      .replace(/\/$/, "")
      .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
      .replace(/(\/?)\*/g, (_, p) => `(${p}.*)?`)
      .replace(/\.(?=[\w(])/, "\\.")
  }/*$`);
};

const route = { lookup: {} } as {
  lookup: { [k: string]: TRouter[] };
  hash?: boolean;
  ssr_path?: string;
};
const w = window;
let lid = 0;
function goto(pathname: string) {
  const path = removeHash(pathname);
  const lookup = route.lookup;
  for (const id in lookup) {
    const target = document.getElementById(id) as HTMLElement;
    const routes = lookup[id];
    const match = routes.find((el) => el.pattern.test(path));
    if (match && target) {
      const comp = () => {
        resetId(lid);
        return match.component({
          go: (path) => goto(path),
          pathname: path,
          params: match.pattern.exec(path)?.groups || {},
          path: match.path,
        });
      };
      render(comp(), target);
      window.history.pushState(
        {},
        "",
        route.hash ? pathname[0] === "#" ? pathname : "#" + pathname : pathname,
      );
      break;
    }
  }
}
export const Link: FC<HTMLAttributes> = (props) => {
  const A = use.a();
  use.mount(() => {
    lid--;
    A.onclick = (e) => {
      e.preventDefault();
      goto(props.href);
    };
  });
  return h(A, props);
};

export const createRouter = (
  opts: RouterOptions = {},
): FC<{ path: string; component: (route: RouteProps) => JSX.Element }> => {
  if (opts.redirect && IS_BROWSER) {
    const { pathname, hash } = w.location;
    if (pathname === "/" && hash === "") {
      w.location.href = opts.hash ? "#" + opts.redirect : opts.redirect;
    }
  }
  const id = ":-r-" + (opts.name || "");
  route.lookup[id] = [];
  route.hash = opts.hash;
  route.ssr_path = opts.ssr_path;
  return ({ path, component }) => {
    let res_path = "";
    if (IS_BROWSER) {
      const { pathname, hash } = w.location;
      res_path = getPathname(pathname, hash);
    } else if (opts.ssr_path) {
      res_path = opts.ssr_path;
    }
    const pattern = createPattern(path);
    route.lookup[id].push({ path, pattern, component });
    if (pattern.test(res_path)) {
      const comp = () => {
        return component({
          go: (path) => goto(path),
          pathname: res_path,
          params: pattern.exec(res_path)?.groups || {},
          path,
        });
      };
      return h("div", { id }, comp());
    }
    return null;
  };
};
