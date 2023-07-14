# van-jsx

[![GitHub](https://img.shields.io/github/license/herudi/van-jsx)](https://github.com/herudi/van-jsx/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/van-jsx)](https://www.npmjs.com/package/van-jsx)
[![bundlejs](https://deno.bundlejs.com/?q=esm:van-jsx@0.0.14&badge=)](https://www.npmjs.com/package/van-jsx)

A small ~1kb JSX libs for building Vanilla App.

- Control JSX with vanilla-js.
- SSR Ready.
- TypeScript support out of the box.
- No virtual-dom.
- Router with SSR support.
- Helmet with SSR support.

## Starter

### Client App

```bash
npx degit herudi/van-jsx-starter my-app

cd my-app

// install deps
npm install

// run dev
npm run dev

// build
npm run build
```

### SSR App

<i>Coming Soon...</i>

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

import { createHost, h, render } from "van-jsx";

const Counter = () => {
  const state = { count: 0 };
  const Host = createHost();

  Host.controller = ({ btn, count }) => {
    btn.onclick = () => {
      count.innerText = (state.count += 1).toString();
    };
  };

  return (
    <Host>
      <button ref="btn">Click Me</button>
      <h1 ref="count">{state.count}</h1>
    </Host>
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

import { h } from "van-jsx";
import App from "./app.tsx";

// example using express
app.get("/", (req, res) => {
  const html = (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>My App</title>
      </head>
      <body>
        <div id="root">
          <App />
        </div>
        <script src="/client.js"></script>
      </body>
    </html>
  );
  res.send(html);
});

// on the client interactive
hydrate(<App />, document.getElementById("root"));
```

## Router

```jsx
import { createRouter, Link } from "van-jsx/router";

const App = () => {
  const Route = createRouter();
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

## Helmet

```jsx
import { Helmet } from "van-jsx/helmet";

const App = () => {
  return (
    <Host>
      <Helmet>
        <title>Hello App</title>
        <script>{`console.log("hello from head")`}</script>
      </Helmet>
      <Helmet footer>
        <script>{`console.log("hello from body")`}</script>
      </Helmet>
      <div>
        <h1>Hello App</h1>
      </div>
    </Host>
  );
};
```

## Helmet SSR

```jsx
import { Helmet } from "van-jsx/helmet";

// example using express
app.get("/", (req, res) => {
  const { head, attr, body, footer } = Helmet.rewind(<App />);
  const html = (
    <html lang="en" {...attr.html.toJSON()}>
      <head>
        <meta charset="utf-8" />
        {head}
      </head>
      <body {...attr.body.toJSON()}>
        <div id="root">
          {body}
        </div>
        <script src="/client.js"></script>
        {footer}
      </body>
    </html>
  );
  res.send(html);
});
```

## Host

Just Fragment to control jsx with vanilla-js.

```jsx
const MyComp = () => {
  const Host = createHost();

  Host.controller = ({ my_text }) => {
    // my_text is a ref="my_text"

    my_text.innerText = "Bar";
  };

  return (
    <Host>
      <h1 ref="my_text">Foo</h1>
    </Host>
  );
};

// Dom updated.
// <h1>Bar</h1>
```

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

## Lazy SSR

```jsx
const Home = await lazySSR(() => import("./home.tsx"));
```

## Example Todo App

```jsx
const Item: FC<{ name: string }> = (props) => {
  // create Host as li
  const Host = createHost("li");

  Host.controller = ({ item, remove }) => {
    remove.onclick = () => item.remove();
  };

  return (
    <Host ref="item">
      <span>{props.name}</span>
      <button ref="remove">remove</button>
    </Host>
  );
};
const Todo: FC<{ data: string[] }> = (props) => {
  // inital state from server
  const state = { todos: props.data };

  const Host = createHost();

  Host.controller = ({ form, input, list }) => {
    form.onsubmit = (e) => {
      e.preventDefault();
      list.append(<Item name={input.value} />);
      input.value = "";
      input.focus();
    };
  };

  return (
    <Host>
      <h1>Welcome Todo</h1>
      <form ref="form">
        <input ref="input" placeholder="text..." />
        <button type="submit">Submit</button>
      </form>
      <div ref="list">{state.todos.map((name) => <Item name={name} />)}</div>
    </Host>
  );
};
```

## License

[MIT](LICENSE)
