# van-jsx

[![GitHub](https://img.shields.io/github/license/herudi/van-jsx)](https://github.com/herudi/van-jsx/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/van-jsx)](https://www.npmjs.com/package/van-jsx)
[![bundlejs](https://deno.bundlejs.com/?q=esm:van-jsx@0.0.2&badge=)](https://www.npmjs.com/package/van-jsx)

A small 1kb JSX libs for creating UI/SSR with vanilla and hooks.

- Control JSX with vanilla-js and hooks.
- No virtual-dom.
- SSR Ready.
- TypeScript support out of the box.

## Install

### Npm

```bash
npm i van-jsx
```

### Deno

```ts
import {...} from "https://deno.land/x/van_jsx/mod.ts";
```

## Usage

```jsx
/* @jsx h */
/* @jsxFrag h.Fragment */

import { h, render, use } from "van-jsx";

const Counter = () => {
  const state = { count: 0 };
  const [btn, Button] = use.button();
  const [count, Count] = use.span();

  use.mount(() => {
    // ready to use vanilla.
    btn.onclick = () => {
      count.innerText = (state.count += 1).toString();
    };
  });

  return (
    <Button>
      Click Me <Count>{state.count}</Count>
    </Button>
  );
};

render(<Counter />, document.getElementById("root"));

// No problem
// render(
//   <>
//     <Counter />
//     <Counter />
//     <Counter />
//   </>,
//   document.getElementById("root"),
// );
```

## State Binding

```jsx
const Counter = () => {
  const state = { count: 0 };
  const [btn, Button] = use.button();
  const [count, Count] = use.span();

  use.mount(() => {
    btn.onclick = () => state.count++;
  });

  use.bind(state, "count", (val) => {
    count.innerText = val.toString();
  });

  return (
    <Button>
      Click Me <Count>{state.count}</Count>
    </Button>
  );
};
```

## SSR

```jsx
console.log(<Counter />);
// <button>Click Me <span>0</span></button>
```

## Use

### use.[HTMLElement]

Hook HTMLElement to markup.

### use.element

Hook HTMLElement / FunctionComponent to markup.

### use.mount

Access Dom after render.

### use.bind

Bind state to UI.

## Options Hook

### Options.elem

Attach where element is created.

```jsx
options.elem = (data) => {
  console.log(data);
};
```

### Options.fc

Attach where FunctionComponent is created.

```jsx
options.fc = (data) => {
  console.log(data);
};
```

## Example Todo App

```jsx
const Item: FC<{ name: string }> = (props) => {
  const [item, TodoItem] = use.li();
  const [remove, Remove] = use.button();

  use.mount(() => {
    remove.onclick = () => item.remove();
  });

  return (
    <TodoItem>
      <span>{props.name}</span>
      <Remove>remove</Remove>
    </TodoItem>
  )
}
const Todo: FC<{ data: string[] }> = (props) => {
  // inital state from server
  const state = { todos: props.data };

  const [form, Form] = use.form();
  const [input, TodoInput] = use.input();
  const [list, TodoList] = use.div();

  use.mount(() => {
    form.onsubmit = (e) => {
      e.preventDefault();
      list.append(<Item name={input.value}/>);
      input.value = "";
      input.focus();
    };
  });

  return (
    <>
      <h1>Welcome Todo</h1>
      <Form>
        <TodoInput placeholder="text..." />
        <button type="submit">Submit</button>
      </Form>
      <TodoList>{state.todos.map((name) => <Item name={name}/>)}</TodoList>
    </>
  );
};
```

## License

[MIT](LICENSE)
