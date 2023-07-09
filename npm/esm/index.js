// npm/src/index.ts
var IS_BROWSER = typeof document !== "undefined";
var dangerHTML = "dangerouslySetInnerHTML";
var isFunc = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isObject = (val) => typeof val === "object";
var isNumber = (val) => typeof val === "number";
var isValue = (val) => val != null;
var options = {};
var isValidElement = (elem) => {
  return IS_BROWSER ? isFunc(elem.append) : isString(elem) && elem[0] === "<";
};
var toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (isNumber(val[b]) ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
var mutateAttr = (root, elem) => {
  const childs = root.childNodes;
  const dests = elem.childNodes;
  childs.forEach((src, i) => {
    const dest = dests[i];
    if (dest) {
      const srcAttr = src.attributes || [];
      for (let i2 = 0; i2 < srcAttr.length; i2++) {
        const attr = srcAttr[i2];
        if (attr.name && dest.setAttribute) {
          dest.setAttribute(attr.name, attr.value);
        }
      }
      if (src.childElementCount) {
        mutateAttr(src, dest);
      }
    }
  });
};
function render(elem, root, isHydrate) {
  if (root) {
    if (isHydrate)
      mutateAttr(root, elem);
    root.innerHTML = "";
    root.append(elem);
  }
}
function hydrate(elem, root) {
  render(elem, root, true);
}
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
var lazy = (importFn, fallback) => {
  return (props) => {
    const Host = createHost();
    Host.controller = ({ lazy: lazy2 }) => {
      importFn().then((mod) => {
        lazy2.replaceWith(mod.default(props));
      });
    };
    return h(Host, {}, h("div", { ref: "lazy" }, fallback));
  };
};
export {
  Fragment,
  IS_BROWSER,
  createHost,
  h,
  hydrate,
  isValidElement,
  lazy,
  options,
  render
};
