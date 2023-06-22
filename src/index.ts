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
export interface Hook<T, V> {
  __watcher: Watchers<V>;
  __idx: number;
  id: string;
  each: <K = HTMLElement>(callback: (node: K) => void) => void;
  value: V;
  elem: T;
  watch: (callback: (value: V) => void) => void;
  on: <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListenerOrEventListenerObject,
  ) => void;
}
interface HookElement<T, V> extends Hook<T, V> {
  template: JSX.Element;
}
type Watchers<V> = ((value: V) => void)[];
const token = ":_",
  shimFn = () => {},
  emreg =
    /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;
let idx = 0;
export const IS_BROWSER = typeof document !== "undefined";
const dangerHTML = "dangerouslySetInnerHTML";
const isFunc = (val: TRet) => typeof val === "function";
export const isValidElement = (elem: JSX.Element) =>
  typeof elem === "object" && elem.type && elem.props;
export const tick = Promise.prototype.then.bind(Promise.resolve());
export function renderToString(component: JSX.Element): string {
  if (isFunc(component)) component = component();
  if (typeof component !== "object" || !component) return component;
  if (component._t) component = component._t();
  const toArray = (res: TRet) => {
    const arr = [];
    for (let i = 0; i < res.length; i++) {
      arr.push(renderToString(res[i]));
    }
    return arr.flat().join("");
  };
  if (Array.isArray(component)) return toArray(component);
  if (component && component.props === void 0) return component;
  const res = component.type(component.props);
  if (res) {
    if (res.props !== void 0) return renderToString(res);
    if (res.pop) return toArray(res);
  }
  return res;
}

export function onMounted(callback: MountedCallback) {
  if (IS_BROWSER) tick(() => callback());
}

export function render(
  component: JSX.Element,
  root: HTMLElement | null,
) {
  const res = renderToString(component);
  if (root) root.innerHTML = res;
}
export function h(
  type: string | TRet,
  props: TRet | null | undefined,
  ...args: TRet
) {
  props ||= {};
  // delete ID from unique if SSR
  if (IS_BROWSER === false && typeof props.id === "object") {
    delete props.id;
  }
  type ||= "";
  if (type._t) type = type._t();
  const children = args.map((
    el: TRet,
  ) => (typeof el === "number" ? String(el) : el))
    .filter(Boolean);
  if (children.length) props.children = children.flat();
  if (isFunc(type)) {
    return { type, props, key: void 0 };
  }
  let str = `<${type}`;
  for (let k in props) {
    let val = props[k];
    if (k === "className") k = "class";
    if (IS_BROWSER && (val === void 0 || val === null)) val = "";
    if (
      val !== void 0 &&
      val !== null &&
      k !== dangerHTML &&
      k !== "children"
    ) {
      const tp = typeof val;
      const key = k.toLowerCase();
      if (tp === "function" || tp === "boolean" || tp === "object") {
        if (!key.startsWith("__")) {
          if (tp === "object") {
            if (key === "id") {
              str += ` ${key}="${val.id}"`;
            } else {
              str += ` ${k}="${
                Object.keys(val).reduce(
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
                )
              }"`;
            }
          } else if (val === true) str += ` ${k}`;
          else if (val === false) str += "";
        }
      } else {
        str += ` ${key}="${val}"`;
      }
    }
  }
  str += ">";
  if (emreg.test(type)) return { type, props, key: void 0, _t: () => str };
  if (props[dangerHTML]) {
    str += props[dangerHTML].__html;
  } else {
    for (let i = 0; i < children.length; i++) {
      const child = renderToString(children[i]);
      if (typeof child === "string") str += child;
    }
  }
  str += type ? `</${type}>` : "";
  return { type, props, key: void 0, _t: () => str };
}
export const Fragment: FC = (props) => props.children;

h.Fragment = Fragment;

export function useId<T = HTMLElement, V = TRet>(value?: V): Hook<T, V> {
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
        return document.getElementById(id) as T;
      },
      get value() {
        return value;
      },
      set value(v) {
        value = v;
        this.__watcher.forEach((fn) => fn(value as TRet));
      },
      each(callback) {
        if (this.__idx < 2) {
          callback(this.elem as TRet);
        } else {
          document.querySelectorAll(`[id="${id}"]`).forEach((node) => {
            callback(node as TRet);
          });
        }
      },
      watch(callback) {
        this.__watcher.push(callback);
      },
      on(type, listener) {
        tick(() => {
          const key = "on" + type;
          this.each((elem: TRet) => {
            elem[key] = listener;
          });
        });
      },
    } as Hook<T, V>;
  }
  return { watch: shimFn, on: shimFn, each: shimFn } as TRet;
}

export function useElement<T = HTMLElement, V = TRet, F = TRet>(
  type: keyof HTMLElementTagNameMap | FC<F>,
  value?: V,
  template?: (value: V) => JSX.Element,
): [HookElement<T, V>, FC<F>] {
  const hook = useId<T, V>(value) as HookElement<T, V>;
  const noTemplate = template === undefined;
  const hasInner = typeof type === "string" && emreg.test(type) === false;
  if (type === "input") {
    hook.watch((val: TRet) => {
      hook.each((elem: TRet) => {
        if (typeof val === "number") val = val.toString();
        elem.value = val;
      });
    });
    tick(() => {
      hook.each((elem) => {
        elem.onchange = (e: TRet) => {
          hook.value = e.target.value;
        };
      });
    });
  } else if (hasInner) {
    hook.watch((val: TRet) => {
      hook.each((elem) => {
        if (noTemplate) {
          elem.innerText = val.toString();
        } else {
          elem.innerHTML = renderToString(template(val));
        }
      });
    });
  }
  hook.template = noTemplate ? value : template(value as V);
  return [hook, (props: TRet) => {
    props.id = hook.id;
    return h(type, props, ...(props.children || []));
  }];
}
