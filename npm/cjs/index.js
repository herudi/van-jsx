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

// npm/src/index.ts
var src_exports = {};
__export(src_exports, {
  Fragment: () => Fragment,
  IS_BROWSER: () => IS_BROWSER,
  h: () => h,
  initSSR: () => initSSR,
  isValidElement: () => isValidElement,
  options: () => options,
  render: () => render,
  resetId: () => resetId,
  rewind: () => rewind,
  use: () => use
});
module.exports = __toCommonJS(src_exports);
var IS_BROWSER = typeof document !== "undefined";
var dangerHTML = "dangerouslySetInnerHTML";
var isFunc = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isObject = (val) => typeof val === "object";
var isValue = (val) => val != null;
var doc = IS_BROWSER ? document : {};
var idx = 0;
var options = {};
var isValidElement = (elem) => {
  return IS_BROWSER ? elem instanceof HTMLElement : isString(elem) && elem[0] === "<";
};
var toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
function resetId(value) {
  idx = isValue(value) ? value : 0;
}
function initSSR() {
  if (!IS_BROWSER)
    resetId();
}
function render(elem, root) {
  if (root) {
    if (root.hasChildNodes())
      root.innerHTML = "";
    root.append(elem);
  }
}
var rewind = (elem) => render(elem, null);
function h(type, props, ...args) {
  props || (props = {});
  if (isValue(props.children))
    args = args.concat(props.children);
  const children = args.flat().map((el) => typeof el === "number" ? String(el) : el).filter(Boolean);
  if (options.elem)
    options.elem({ props, type });
  if (isFunc(type)) {
    if (children.length) {
      props.children = IS_BROWSER ? children : children.join("");
    }
    if (options.fc)
      options.fc({ props, type });
    const res = type(props);
    if (IS_BROWSER && isValue(res) && res.pop) {
      const fm = new DocumentFragment();
      fm.append(...res);
      return fm;
    }
    return res;
  }
  let elem = IS_BROWSER ? doc.createElement(type) : `<${type}`;
  for (const k in props) {
    let val = props[k];
    if (isValue(val) && k !== dangerHTML && k !== "children" && !isFunc(val)) {
      val = isObject(val) ? toStyle(val) : val === true ? "" : val === false ? null : val;
      if (isValue(val)) {
        let key = k.toLowerCase();
        if (key === "classname")
          key = "class";
        if (IS_BROWSER)
          elem.setAttribute(key, val);
        else
          elem += ` ${key}${val === "" ? "" : `="${val}"`}`;
      }
    }
  }
  if (!IS_BROWSER) {
    elem += ">";
    if (/area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/.test(type))
      return elem;
  }
  if (props[dangerHTML]) {
    const val = props[dangerHTML].__html;
    if (IS_BROWSER)
      elem.innerHTML = val;
    else
      elem += val;
  } else {
    children.forEach((child) => {
      if (isValue(child)) {
        if (IS_BROWSER)
          elem.append(child);
        else if (isString(child))
          elem += child;
        else if (child.pop)
          elem += child.join("");
      }
    });
  }
  return IS_BROWSER ? elem : elem += type ? `</${type}>` : "";
}
var Fragment = (props) => props.children;
h.Fragment = Fragment;
function createElement(type) {
  idx--;
  const id = ":" + idx;
  const elem = () => doc.getElementById(id) || doc.querySelector(`[ref="${id}"]`);
  let _idx = 0;
  const each = (callback) => {
    if (_idx < 2) {
      callback(elem(), 0);
    } else {
      doc.querySelectorAll(`[id="${id}"], [ref="${id}"]`).forEach(
        (node, i) => {
          callback(node, i);
        }
      );
    }
  };
  const toEach = (cb) => {
    each((node, i) => {
      if (node) {
        cb(node);
        node.index = i;
      }
    });
  };
  const hook = (props) => {
    if (isValue(props.id))
      props.ref = id;
    else
      props.id = id;
    _idx++;
    return h(type, props);
  };
  hook.id = id;
  if (IS_BROWSER) {
    return Object.setPrototypeOf(
      hook,
      new Proxy({}, {
        get: (_, prop, rec) => {
          if (isString(prop)) {
            const el = elem() || {};
            if (isFunc(el[prop])) {
              return (...args) => toEach((node) => node[prop](...args));
            }
            if (isValue(el[prop]))
              return el[prop];
          }
          return rec;
        },
        set: (_, prop, val) => {
          if (isString(prop)) {
            toEach((node) => {
              node[prop] = val;
            });
          }
          return true;
        }
      })
    );
  }
  return hook;
}
var use = Object.setPrototypeOf(
  {
    element: createElement,
    mount: (cb) => {
      if (IS_BROWSER)
        Promise.resolve().then(cb);
      return cb;
    }
  },
  new Proxy({}, {
    get: (_, prop) => () => {
      return createElement(prop);
    }
  })
);
