import { Fragment, h } from "van-jsx";
const createElement = (type, props) => {
  const hasChild = props.children != null;
  const children = hasChild ? props.children : [];
  if (hasChild)
    delete props.children;
  const arr = children.pop ? children : [children];
  return h(type, props, ...arr);
};
export {
  Fragment,
  createElement as jsx,
  createElement as jsxDEV,
  createElement as jsxDev,
  createElement as jsxs
};
