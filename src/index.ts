// deno-lint-ignore no-explicit-any
export type TRet = any;
declare global {
  export namespace JSX {
    // @ts-ignore: elem
    type Element = TRet;
    interface IntrinsicElements {
      // @ts-ignore: elem
      [k: string]: TRet;
    }
  }
}
type JsxProps = {
  children?: TRet;
};
type Merge<A, B> = {
  [K in keyof (A & B)]: (
    K extends keyof B ? B[K]
      : (K extends keyof A ? A[K] : never)
  );
};
type HTMLBasicElement = HTMLElement & HTMLInputElement;
export type RefElement = { [k: string]: HTMLBasicElement };
export type CTR<Ref extends unknown = unknown> = (ref: Ref) => void;
export type FC<T extends unknown = unknown> = (
  props: JsxProps & T,
) => JSX.Element;
type Options = {
  elem?: (elem: JSX.Element) => void;
  fc?: (elem: JSX.Element) => void;
};
export interface HTMLAttributes {
  accessKey?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  class?: string;
  className?: string;
  contentEditable?: boolean | "inherit";
  contextMenu?: string;
  dir?: string;
  draggable?: boolean;
  hidden?: boolean;
  id?: string;
  lang?: string;
  nonce?: string;
  placeholder?: string;
  slot?: string;
  spellCheck?: boolean;
  style?: string;
  tabIndex?: number;
  title?: string;
  translate?: "yes" | "no";
  dangerouslySetInnerHTML?: {
    __html: string;
  };
  type?: string;
  name?: string;
  [k: string]: TRet;
}
export const IS_BROWSER = typeof document !== "undefined";
const dangerHTML = "dangerouslySetInnerHTML";
const isFunc = <T>(val: T) => typeof val === "function";
const isValue = <T>(val: T) => val != null;
export const options = {} as Options;
export function render(
  elem: JSX.Element,
  root: HTMLElement | null,
) {
  if (root) {
    if (root.hasChildNodes()) root.innerHTML = "";
    root.append(elem);
  }
}
function removeRef(res: TRet) {
  res.forEach((elem: Element) => {
    if (elem.removeAttribute) elem.removeAttribute("ref");
    if (elem.childElementCount) removeRef(elem.childNodes);
  });
}
export function h(
  type: string | TRet,
  props?: TRet | null | undefined,
  ...args: TRet
) {
  props ||= {};
  if (isValue(props.children)) args = args.concat(props.children);
  const children = args.flat().map((
    el: TRet,
  ) => (typeof el === "number" ? String(el) : el)).filter(Boolean);
  if (options.elem) options.elem({ props, type });
  if (isFunc(type)) {
    if (children.length) {
      props.children = IS_BROWSER ? children : children.join("");
    }
    if (options.fc) options.fc({ props, type });
    const res = type(props);
    if (IS_BROWSER && isValue(res) && res.pop) {
      const fm = new DocumentFragment();
      fm.append(...res);
      if (props.__fn) {
        props.__fn(
          new Proxy({}, {
            get: (_, prop: string) => fm.querySelector(`[ref="${prop}"]`),
          }),
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
    if (
      isValue(val) &&
      k !== dangerHTML &&
      k !== "children" &&
      !isFunc(val)
    ) {
      val = val === true ? "" : val === false ? null : val;
      if (isValue(val)) {
        let key = k.toLowerCase();
        if (key === "classname") key = "class";
        if (IS_BROWSER) elem.setAttribute(key, val);
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
    if (
      /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/
        .test(type)
    ) return elem;
  }
  if (props[dangerHTML]) {
    const val = props[dangerHTML].__html;
    if (IS_BROWSER) elem.innerHTML = val;
    else elem += val;
  } else {
    children.forEach((child: TRet) => {
      if (isValue(child)) {
        if (IS_BROWSER) elem.append(child);
        else if (typeof child === "string") elem += child;
        else if (child.pop) elem += child.join("");
      }
    });
  }
  return IS_BROWSER ? elem : (elem += type ? `</${type}>` : "");
}
export const Fragment: FC = (props) => props.children;

h.Fragment = Fragment;

export function createHost<R>(
  type?: keyof HTMLElementTagNameMap,
): FC<TRet> & { controller: CTR<Merge<RefElement, R>> } {
  const host: TRet = (props: TRet) => {
    return h(
      Fragment,
      { __fn: host.controller },
      type ? h(type, props) : props.children,
    );
  };
  return host;
}
export const lazy = <T = TRet>(
  importFn: () => Promise<TRet>,
  fallback?: JSX.Element,
): FC<T> => {
  return (props) => {
    const Host = createHost();
    Host.controller = ({ lazy }) => {
      importFn().then((mod) => {
        lazy.replaceWith(mod.default(props));
      });
    };
    return h(Host, {}, h("div", { ref: "lazy" }, fallback));
  };
};
