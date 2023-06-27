import { Fragment, h } from "./index.ts";
// deno-lint-ignore no-explicit-any
type TRet = any;

type CrateElement = (type: TRet, props: TRet, ...args: TRet) => TRet;
const createElement: CrateElement = (type, props) => {
  const children = props.children || [];
  if (props.children) delete props.children;
  const arr = children.pop ? children : [children];
  return h(type, props, ...arr);
};
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
