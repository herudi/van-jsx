import { Fragment, h } from "van-jsx";
const createElement = (type, props) => {
  const children = props.children || [];
  if (props.children)
    delete props.children;
  const arr = children.pop ? children : [children];
  return h(type, props, ...arr);
};
export {
  Fragment,
  createElement as jsx,
  createElement as jsxDev,
  createElement as jsxs
};
