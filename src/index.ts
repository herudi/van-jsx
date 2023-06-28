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
export type FC<T extends unknown = unknown> = (
  props: JsxProps & T,
) => JSX.Element;
type MountedCallback = () => void;
type HookId<T = HTMLElement> = {
  id: string;
} & T;
type Hooked<T = HTMLElement, F = TRet> = () => [HookId<T>, FC<F>];
type UseHook =
  & {
    [k in keyof HTMLElementTagNameMap]: Hooked<
      HTMLElementTagNameMap[k],
      HTMLAttributes
    >;
  }
  & {
    element: <T = HTMLElement, F = TRet>(
      type: keyof HTMLElementTagNameMap | FC<F>,
    ) => [HookId<T>, FC<F>];
    bind: <S, K extends keyof S>(
      state: S,
      key: K,
      callback: (val: S[K]) => void,
    ) => void;
    mount: (callback: MountedCallback) => void;
  };
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
  style?: { [k: string]: TRet } | string;
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
const isString = <T>(val: T) => typeof val === "string";
const isObject = <T>(val: T) => typeof val === "object";
const isValue = <T>(val: T) => val != null;
const doc = IS_BROWSER ? document : {} as Document;
let idx = 0;
export const options = {} as Options;
export const isValidElement = (elem: JSX.Element) => {
  return IS_BROWSER
    ? elem instanceof HTMLElement
    : (isString(elem) && elem[0] === "<");
};
const wait = Promise.prototype.then.bind(Promise.resolve());
const toStyle = (val: Record<string, TRet>) => {
  return Object.keys(val).reduce(
    (a, b) =>
      a +
      b
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      (typeof val[b] === "number" ? val[b] + "px" : val[b]) +
      ";",
    "",
  );
};
export const renderSSR = (
  template: JSX.Element | string,
  doctype?: boolean,
) => {
  idx = 0;
  return doctype !== false ? "<!doctype html>" + template : template;
};
export const rewind = (elem: JSX.Element) => elem;
export function render(
  elem: JSX.Element,
  root: HTMLElement | null,
) {
  if (root) {
    if (root.hasChildNodes()) root.innerHTML = "";
    if (elem.pop) {
      elem.forEach((child: ChildNode) => {
        root.append(child);
      });
    } else {
      root.append(elem);
    }
  }
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
    return type(props);
  }
  let elem = IS_BROWSER ? doc.createElement(type) : `<${type}`;
  for (const k in props) {
    let val = props[k];
    if (
      isValue(val) &&
      k !== dangerHTML &&
      k !== "children" &&
      !isFunc(val)
    ) {
      val = isObject(val)
        ? toStyle(val)
        : val === true
        ? ""
        : val === false
        ? null
        : val;
      if (isValue(val)) {
        let key = k.toLowerCase();
        if (key === "classname") key = "class";
        if (IS_BROWSER) elem.setAttribute(key, val);
        else elem += ` ${key}${val === "" ? "" : `="${val}"`}`;
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
        else if (isString(child)) elem += child;
        else if (child.pop) elem += child.join("");
      }
    });
  }
  return IS_BROWSER ? elem : (elem += type ? `</${type}>` : "");
}
export const Fragment: FC = (props) => props.children;

h.Fragment = Fragment;

function createHook<T = HTMLElement>(): HookId<T> {
  idx--;
  const id = ":" + idx;
  const elem: TRet = () =>
    doc.getElementById(id) || doc.querySelector(`[ref="${id}"]`);
  let _idx = 0;
  const each = (callback: (elem: T, i: number) => void) => {
    if (_idx < 2) {
      callback(elem(), 0);
    } else {
      doc.querySelectorAll(`[id="${id}"], [ref="${id}"]`).forEach(
        (node, i) => {
          callback(node as T, i);
        },
      );
    }
  };
  const toEach = (cb: (node: TRet) => void) => {
    each((node: TRet, i) => {
      if (node) {
        cb(node);
        node.index = i;
      }
    });
  };
  const hook = {
    id,
    get _id() {
      _idx++;
      return id;
    },
  } as TRet;
  if (IS_BROWSER) {
    return Object.setPrototypeOf(
      hook,
      new Proxy({}, {
        get: (_, prop, rec) => {
          if (isString(prop)) {
            const el = elem() || {};
            if (isFunc(el[prop])) {
              return (...args: TRet) => toEach((node) => node[prop](...args));
            }
            if (isValue(el[prop])) return el[prop];
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
        },
      }),
    ) as HookId<T>;
  }
  return hook;
}
function createElement<T = HTMLElement, F = TRet>(
  type: keyof HTMLElementTagNameMap | FC<F>,
): [HookId<T>, FC<F>] {
  const hook = createHook<T>();
  return [hook, (props: TRet) => {
    const id = (<TRet> hook)._id;
    if (isValue(props.id)) props.ref = id;
    else props.id = id;
    return h(type, props);
  }];
}
export const use: UseHook = Object.setPrototypeOf(
  {
    element: createElement,
    bind: <S, K extends keyof S>(
      state: S,
      key: K,
      cb: (val: S[K]) => void,
    ) => {
      let val = state[key];
      Object.defineProperty(state, key, {
        get: () => val,
        set: (v) => cb(val = v),
      });
    },
    mount: (cb: MountedCallback) => {
      if (IS_BROWSER) wait(cb);
      return cb;
    },
  },
  new Proxy({}, {
    get: (_, prop: keyof HTMLElementTagNameMap, rec) => () => {
      if (isString(prop)) return createElement(prop);
      return rec;
    },
  }),
) as TRet;
