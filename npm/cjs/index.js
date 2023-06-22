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
  isValidElement: () => isValidElement,
  onMounted: () => onMounted,
  render: () => render,
  renderToString: () => renderToString,
  tick: () => tick,
  useElement: () => useElement,
  useId: () => useId
});
module.exports = __toCommonJS(src_exports);
var token = ":_";
var shimFn = () => {
};
var emreg = /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;
var idx = 0;
var IS_BROWSER = typeof document !== "undefined";
var dangerHTML = "dangerouslySetInnerHTML";
var isFunc = (val) => typeof val === "function";
var isValidElement = (elem) => typeof elem === "object" && elem.type && elem.props;
var tick = Promise.prototype.then.bind(Promise.resolve());
function renderToString(component) {
  if (isFunc(component))
    component = component();
  if (typeof component !== "object" || !component)
    return component;
  if (component._t)
    component = component._t();
  const toArray = (res2) => {
    const arr = [];
    for (let i = 0; i < res2.length; i++) {
      arr.push(renderToString(res2[i]));
    }
    return arr.flat().join("");
  };
  if (Array.isArray(component))
    return toArray(component);
  if (component && component.props === void 0)
    return component;
  const res = component.type(component.props);
  if (res) {
    if (res.props !== void 0)
      return renderToString(res);
    if (res.pop)
      return toArray(res);
  }
  return res;
}
function onMounted(callback) {
  if (IS_BROWSER)
    tick(() => callback());
}
function render(component, root) {
  const res = renderToString(component);
  if (root)
    root.innerHTML = res;
}
function h(type, props, ...args) {
  props || (props = {});
  if (IS_BROWSER === false && typeof props.id === "object") {
    delete props.id;
  }
  type || (type = "");
  if (type._t)
    type = type._t();
  const children = args.map((el) => typeof el === "number" ? String(el) : el).filter(Boolean);
  if (children.length)
    props.children = children.flat();
  if (isFunc(type)) {
    return { type, props, key: void 0 };
  }
  let str = `<${type}`;
  for (let k in props) {
    let val = props[k];
    if (k === "className")
      k = "class";
    if (IS_BROWSER && (val === void 0 || val === null))
      val = "";
    if (val !== void 0 && val !== null && k !== dangerHTML && k !== "children") {
      const tp = typeof val;
      const key = k.toLowerCase();
      if (tp === "function" || tp === "boolean" || tp === "object") {
        if (!key.startsWith("__")) {
          if (tp === "object") {
            if (key === "id") {
              str += ` ${key}="${val.id}"`;
            } else {
              str += ` ${k}="${Object.keys(val).reduce(
                (a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
                ""
              )}"`;
            }
          } else if (val === true)
            str += ` ${k}`;
          else if (val === false)
            str += "";
        }
      } else {
        str += ` ${key}="${val}"`;
      }
    }
  }
  str += ">";
  if (emreg.test(type))
    return { type, props, key: void 0, _t: () => str };
  if (props[dangerHTML]) {
    str += props[dangerHTML].__html;
  } else {
    for (let i = 0; i < children.length; i++) {
      const child = renderToString(children[i]);
      if (typeof child === "string")
        str += child;
    }
  }
  str += type ? `</${type}>` : "";
  return { type, props, key: void 0, _t: () => str };
}
var Fragment = (props) => props.children;
h.Fragment = Fragment;
function useId(value) {
  if (IS_BROWSER) {
    idx--;
    const id = token + idx;
    return {
      __idx: 0,
      __watcher: [],
      get id() {
        this.__idx++;
        return id;
      },
      get elem() {
        return document.getElementById(id);
      },
      get value() {
        return value;
      },
      set value(v) {
        value = v;
        this.__watcher.forEach((fn) => fn(value));
      },
      each(callback) {
        if (this.__idx < 2) {
          callback(this.elem);
        } else {
          document.querySelectorAll(`[id="${id}"]`).forEach((node) => {
            callback(node);
          });
        }
      },
      watch(callback) {
        this.__watcher.push(callback);
      },
      on(type, listener) {
        tick(() => {
          const key = "on" + type;
          this.each((elem) => {
            elem[key] = listener;
          });
        });
      }
    };
  }
  return { watch: shimFn, on: shimFn, each: shimFn };
}
function useElement(type, value, template) {
  const hook = useId(value);
  const noTemplate = template === void 0;
  const hasInner = typeof type === "string" && emreg.test(type) === false;
  if (type === "input") {
    hook.watch((val) => {
      hook.each((elem) => {
        if (typeof val === "number")
          val = val.toString();
        elem.value = val;
      });
    });
    tick(() => {
      hook.each((elem) => {
        elem.onchange = (e) => {
          hook.value = e.target.value;
        };
      });
    });
  } else if (hasInner) {
    hook.watch((val) => {
      hook.each((elem) => {
        if (noTemplate) {
          elem.innerText = val.toString();
        } else {
          elem.innerHTML = renderToString(template(val));
        }
      });
    });
  }
  hook.template = noTemplate ? value : template(value);
  return [hook, (props) => {
    props.id = hook.id;
    return h(type, props, ...props.children || []);
  }];
}
