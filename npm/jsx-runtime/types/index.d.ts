import { Fragment, TRet } from "van-jsx";
type CrateElement = (type: TRet, props: TRet, ...args: TRet) => TRet;
declare const createElement: CrateElement;
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
