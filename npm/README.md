# van-jsx

[![GitHub](https://img.shields.io/github/license/herudi/van-jsx)](https://github.com/herudi/van-jsx/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/van-jsx)](https://www.npmjs.com/package/van-jsx)
[![bundlejs](https://deno.bundlejs.com/?q=esm:van-jsx@0.0.9&badge=)](https://www.npmjs.com/package/van-jsx)

A small 1kb JSX libs for building SSR/UI with vanilla and hooks.

- Control JSX with vanilla-js and hooks.
- Fast SSR without rehydration or re-render.
- TypeScript support out of the box.
- No virtual-dom.
- Router with SSR support.

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
  const Button = use.button();
  const Count = use.span();

  use.mount(() => {
    // ready to use vanilla.
    Button.onclick = () => {
      Count.innerText = (state.count += 1).toString();
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

## SSR

```jsx
/* @jsx h */
/* @jsxFrag h.Fragment */

import { h, initSSR, rewind } from "van-jsx";
import App from "./app.tsx";

// example using express
app.get("/", (req, res) => {
  initSSR();
  const html = (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>My App</title>
      </head>
      <body>
        <App />
        <script src="/client.js"></script>
      </body>
    </html>
  );
  res.send(html);
});

// on the client interactive
rewind(<App />);
```

## Router

```jsx
import { createRouter, Link } from "van-jsx/router";

const App: FC<{ path?: string }> = ({ path }) => {
  const Route = createRouter({ name: "app", ssr_path: path });
  return (
    <>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
      <Route path="/" component={() => <Home />} />
      <Route path="/about" component={() => <About />} />
    </>
  );
};
```

## Use

### use.[HTMLElement]

Hook HTMLElement to markup.

### use.element

Hook HTMLElement / FunctionComponent to markup.

### use.mount

Access Dom after render.

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

## Lazy

```jsx
const Home = lazy(() => import("./home.tsx"));
```

## Example Todo App

```jsx
const Item: FC<{ name: string }> = (props) => {
  const TodoItem = use.li();
  const Remove = use.button();

  use.mount(() => {
    Remove.onclick = () => TodoItem.remove();
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

  const Form = use.form();
  const TodoInput = use.input();
  const TodoList = use.div();

  use.mount(() => {
    Form.onsubmit = (e) => {
      e.preventDefault();
      TodoList.append(<Item name={TodoInput.value}/>);
      TodoInput.value = "";
      TodoInput.focus();
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
