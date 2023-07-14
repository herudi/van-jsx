// npm/src/index.ts
var IS_BROWSER = typeof document !== "undefined";
var dangerHTML = "dangerouslySetInnerHTML";
var isFunc = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isObject = (val) => typeof val === "object";
var isNumber = (val) => typeof val === "number";
var isValue = (val) => val != null;
var options = {};
var toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (isNumber(val[b]) ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
function render(elem, root) {
  if (root) {
    if (root.hasChildNodes())
      root.innerHTML = "";
    root.append(elem);
  }
}
var hydrate = render;
function removeRef(res) {
  res.forEach((elem) => {
    if (elem.removeAttribute)
      elem.removeAttribute("ref");
    if (elem.childElementCount)
      removeRef(elem.childNodes);
  });
}
function h(type, props, ...args) {
  props || (props = {});
  if (isValue(props.children))
    args = args.concat(props.children);
  const children = args.flat().map((el) => isNumber(el) ? String(el) : el).filter(Boolean);
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
      if (props.__fn) {
        props.__fn(
          new Proxy({}, {
            get: (_, prop) => fm.querySelector(`[ref="${prop}"]`)
          })
        );
      }
      removeRef(res);
      return fm;
    }
    return res;
  }
  let elem = IS_BROWSER ? document.createElement(type) : `<${type}`;
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
        else {
          if (key !== "ref") {
            elem += ` ${key}${val === "" ? "" : `="${val}"`}`;
          }
        }
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
function createHost(type) {
  const host = (props) => {
    return h(
      Fragment,
      { __fn: host.controller },
      type ? h(type, props) : props.children
    );
  };
  return host;
}
var lazy = (importFn, fallback, modify) => {
  return (props) => {
    const Host = createHost();
    Host.controller = ({ lazy: lazy2 }) => {
      importFn().then((mod) => {
        const elem = mod.default(props);
        lazy2.replaceWith(modify ? modify(elem) : elem);
      });
    };
    return h(Host, {}, h("div", { ref: "lazy" }, fallback));
  };
};
var lazySSR = (importFn, fallback, modify) => {
  return IS_BROWSER ? lazy(importFn, fallback, modify) : importFn().then((mod) => mod.default);
};
export {
  Fragment,
  IS_BROWSER,
  createHost,
  h,
  hydrate,
  lazy,
  lazySSR,
  options,
  render
};
