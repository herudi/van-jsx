import { type FC } from "./index.ts";
const IS_BROWSER = typeof document !== "undefined";
class Attr extends Map {
  toString() {
    let string = "";
    this.forEach((v, k) => (string += ` ${k}="${v}"`));
    return string.trim();
  }
  toJSON() {
    return Object.fromEntries(this.entries());
  }
}
export type HelmetRewind = {
  head: string[];
  footer: string[];
  attr: {
    body: Attr;
    html: Attr;
  };
  body?: string;
};
type FCHelmet = FC<{ footer?: boolean }> & {
  rewind: (component?: JSX.Element) => HelmetRewind;
  writeHeadTag?: () => string[];
  writeFooterTag?: () => string[];
  writeHtmlAttr?: () => Attr;
  writeBodyAttr?: () => Attr;
};

function toHelmet(olds: string[], childs: string[], isFooter: boolean) {
  const idx = olds.findIndex((el) => el.startsWith("<title>"));
  const latest = childs.map((item: string) => {
    if (item.startsWith("<title>") && idx !== -1) olds.splice(idx, 1);
    return item;
  }) as string[];
  const arr = latest.concat(olds);
  const res = arr.filter((item, i) => arr.indexOf(item) === i).filter((el) =>
    el[1] !== "/"
  );
  if (isFooter) {
    return res.map((el) => {
      return el.replace(">", ` data-placement="body">`);
    });
  }
  return res;
}

function toAttr(regex: RegExp, child: string) {
  const arr = regex.exec(child) ?? [];
  const map = new Attr();
  if (arr[1]) {
    arr[1].split(/\s+/).forEach((el) => {
      if (el.includes("=")) {
        const [k, v] = el.split(/\=/);
        map.set(k, v.replace(/\"/g, ""));
      } else {
        map.set(el, true);
      }
    });
  }
  return map;
}
let idx = 0, lastIdx = 0;

const lastChild = { footers: [], heads: [] } as {
  [k: string]: HTMLElement[];
};
const compare = (base: HTMLElement, target: HTMLElement) => {
  const hasTag = base.tagName === target.tagName;
  if (hasTag && base.hasChildNodes()) return true;
  if (hasTag && base.hasAttributes()) {
    const str = base.getAttributeNames().join("");
    const str2 = target.getAttributeNames().join("");
    if (str === str2) return true;
  }
  return false;
};
export const Helmet: FCHelmet = ({ children, footer }) => {
  idx++;
  if (IS_BROWSER) {
    if (children) {
      const head = document.head;
      const data = head.querySelector("[data-ssr]");
      const isSSR = data != null &&
        parseInt(data.getAttribute("data-ssr") || "0") >= idx;
      if (isSSR) {
        lastIdx = idx + 1;
      } else {
        if (idx > lastIdx) idx = lastIdx;
        let baseChilds = [] as HTMLElement[];
        const attrChild = [] as HTMLElement[];
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child instanceof HTMLElement) {
            if (["HTML", "BODY"].includes(child.tagName)) {
              attrChild.push(child);
            } else {
              baseChilds.push(child);
            }
          }
        }
        if (attrChild.length) {
          attrChild.forEach((el) => {
            const attrs = el.attributes;
            const target = document.querySelector(
              el.tagName.toLowerCase(),
            );
            if (target != null) {
              if (attrs.length) {
                for (let i = 0; i < attrs.length; i++) {
                  const attr = attrs[i];
                  target.setAttribute(attr.name, attr.value);
                }
              }
            }
          });
        }
        const base = footer ? document.body : head;
        for (const k in lastChild) {
          const childs = base.childNodes;
          for (let i = 0; i < lastChild[k].length; i++) {
            const last = lastChild[k][i];
            childs.forEach((el) => {
              if (compare(el as HTMLElement, last)) base.removeChild(el);
            });
          }
          if (baseChilds.length) {
            if (footer) {
              baseChilds = baseChilds.map((el: HTMLElement) => {
                if (el.setAttribute) {
                  el.setAttribute("data-placement", "body");
                }
                return el;
              });
            } else {
              document.querySelectorAll(`[data-placement="body"]`).forEach(
                (el) => {
                  el.remove();
                },
              );
            }
            base.append(...baseChilds);
          }
        }
      }
      lastChild[footer ? "footers" : "heads"] = children;
    }
  } else {
    if (typeof children !== "string") return null;
    const arr = children.replace(/></g, ">#$n$#<").split("#$n$#");
    const heads = Helmet.writeHeadTag ? Helmet.writeHeadTag() : [];
    const bodys = Helmet.writeFooterTag ? Helmet.writeFooterTag() : [];
    const childs: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      const child = arr[i];
      if (child.startsWith("<html")) {
        Helmet.writeHtmlAttr = () => toAttr(/<html\s([^>]+)>/gm, child);
      } else if (child.startsWith("<body")) {
        Helmet.writeBodyAttr = () => toAttr(/<body\s([^>]+)>/gm, child);
      } else childs.push(child);
    }
    if (footer) Helmet.writeFooterTag = () => toHelmet(bodys, childs, true);
    else Helmet.writeHeadTag = () => toHelmet(heads, childs, false);
  }
  return null;
};

Helmet.rewind = (comp) => {
  const data = {
    attr: { body: new Attr(), html: new Attr() },
    head: [],
    footer: [],
    body: comp,
  } as HelmetRewind;
  if (Helmet.writeHeadTag) data.head = Helmet.writeHeadTag();
  if (Helmet.writeFooterTag) data.footer = Helmet.writeFooterTag();
  if (Helmet.writeHtmlAttr) data.attr.html = Helmet.writeHtmlAttr();
  if (Helmet.writeBodyAttr) data.attr.body = Helmet.writeBodyAttr();
  Helmet.writeHeadTag = void 0;
  Helmet.writeFooterTag = void 0;
  Helmet.writeHtmlAttr = void 0;
  Helmet.writeBodyAttr = void 0;
  if (data.head.length) {
    data.head = [`<meta data-ssr="${idx}">`].concat(data.head);
  }
  idx = 0;
  return data;
};
