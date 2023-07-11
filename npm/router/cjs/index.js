var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var router_exports = {};
__export(router_exports, {
  Link: () => Link,
  createRouter: () => createRouter,
  matchRoute: () => matchRoute
});
module.exports = __toCommonJS(router_exports);
var import_index = require("van-jsx");
let current = "";
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
const matchRoute = (path, route2) => {
  for (const key in route2) {
    if (path === key || createPattern(key).test(path))
      return route2[key];
  }
};
function goto(pathname) {
  const path = removeHash(pathname);
  const realPathname = route.hash ? pathname[0] === "#" ? pathname : "#" + pathname : pathname;
  if (current === realPathname) {
    return;
  }
  const lookup = route.lookup;
  for (const id in lookup) {
    const target = document.getElementById(id);
    const routes = lookup[id];
    const match = routes.find((el) => el.pattern.test(path));
    if (match && target) {
      const comp = () => {
        var _a;
        return match.component({
          go: (path2) => goto(path2),
          pathname: path,
          params: ((_a = match.pattern.exec(path)) == null ? void 0 : _a.groups) || {},
          path: match.path
        });
      };
      (0, import_index.render)(comp(), target);
      current = realPathname;
      window.history.pushState(
        {},
        "",
        current
      );
      break;
    }
  }
}
const Link = (props) => {
  const Host = (0, import_index.createHost)();
  props.ref = "link";
  Host.controller = ({ link }) => {
    link.onclick = (e) => {
      e.preventDefault();
      goto(props.href);
    };
  };
  return (0, import_index.h)(Host, {}, (0, import_index.h)("a", props));
};
const createRouter = (opts = {}) => {
  if (opts.redirect && import_index.IS_BROWSER) {
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
    if (import_index.IS_BROWSER) {
      const { pathname, hash } = w.location;
      res_path = getPathname(pathname, hash);
    } else if (opts.ssr_path) {
      res_path = opts.ssr_path;
    }
    const pattern = createPattern(path);
    route.lookup[id].push({ path, pattern, component });
    if (pattern.test(res_path)) {
      current = res_path;
      const comp = () => {
        var _a;
        return component({
          go: goto,
          pathname: current,
          params: ((_a = pattern.exec(current)) == null ? void 0 : _a.groups) || {},
          path
        });
      };
      return (0, import_index.h)("div", { id }, comp());
    }
    return null;
  };
};
