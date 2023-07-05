import {
  h,
  IS_BROWSER,
  render,
  resetId,
  use
} from "van-jsx";
const removeHash = (path) => path[0] === "#" ? path.substring(1) : path;
const getPathname = (pathname, hash) => {
  if (hash) {
    if (pathname[pathname.length - 1] === "/") {
      pathname = pathname.slice(0, -1);
    }
    pathname = (pathname === "/" ? "/" : pathname + "/") + hash.substring(2);
  }
  return pathname;
};
const createPattern = (path) => {
  return new RegExp(`^${path.replace(/\/$/, "").replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3").replace(/(\/?)\*/g, (_, p) => `(${p}.*)?`).replace(/\.(?=[\w(])/, "\\.")}/*$`);
};
const route = { lookup: {} };
const w = window;
let lid = 0;
function goto(pathname) {
  const path = removeHash(pathname);
  const lookup = route.lookup;
  for (const id in lookup) {
    const target = document.getElementById(id);
    const routes = lookup[id];
    const match = routes.find((el) => el.pattern.test(path));
    if (match && target) {
      const comp = () => {
        var _a;
        resetId(lid);
        return match.component({
          go: (path2) => goto(path2),
          pathname: path,
          params: ((_a = match.pattern.exec(path)) == null ? void 0 : _a.groups) || {},
          path: match.path
        });
      };
      render(comp(), target);
      window.history.pushState(
        {},
        "",
        route.hash ? pathname[0] === "#" ? pathname : "#" + pathname : pathname
      );
      break;
    }
  }
}
const Link = (props) => {
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
const createRouter = (opts = {}) => {
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
        var _a;
        return component({
          go: (path2) => goto(path2),
          pathname: res_path,
          params: ((_a = pattern.exec(res_path)) == null ? void 0 : _a.groups) || {},
          path
        });
      };
      return h("div", { id }, [comp()]);
    }
    return null;
  };
};
export {
  Link,
  createRouter
};
