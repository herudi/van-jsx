# van-jsx

A small 1kb JSX libs with vanilla and hooks.

- Blazing-fast. just call `getElementById`.
- Just-In-Time Render (no need re-render).
- No virtual-dom.
- SSR.

## Install

### Npm

```bash
npm i van-jsx
```

### Deno

```ts
import {...} from "https://deno.land/x/van-jsx/mod.ts";
```

## Usage

```jsx
/* @jsx h */
/* @jsxFrag h.Fragment */

import { h, render, useElement } from "van-jsx";

const Counter = () => {
  const [btn, Button] = useElement("button");
  const [count, Count] = useElement("span", 0);

  btn.on("click", () => {
    count.value++;
  });

  // watch value from count
  count.watch((newVal) => {
    console.log("Count Effects", newVal);
  });

  console.log("only one render");

  return (
    <>
      <h1>Welcome Counter</h1>
      <Button>
        Click Me <Count>{count.value}</Count>
      </Button>
    </>
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

import { h, renderToString } from "van-jsx";

const str = renderToString(<Counter />);

console.log(str);
// <h1>Welcome Counter</h1><button>Click Me <span>0</span></button>
```

## Hooks

### useElement

Hook element to markup.

```ts
useElement(type: string | FC, initValue?: any, template?: (value: any) => JSX.Element);
```

#### Example Todo App

```jsx
const Todo = () => {
  const [form, Form] = useElement("form");
  const [todo, InputTodo] = useElement("input");
  const [todoList, ListTodo] = useElement(
    "div",
    ["todo 1"],
    (value) => value.map((name) => <li>{name}</li>),
  );

  form.on("submit", (e) => {
    e.preventDefault();
    todoList.value = [todo.value, ...todoList.value];
    todo.value = "";
  });

  return (
    <>
      <h1>Welcome Todo</h1>
      <Form>
        <InputTodo placeholder="text..." />
        <button type="submit">Submit</button>
      </Form>
      <ListTodo>{todoList.template}</ListTodo>
    </>
  );
};
```

### useId

Hook id to markup.

```ts
useId(initValue?: any);
```

### Example

```jsx
const Foo = () => {
  const btn = useId();

  btn.on("click", () => {
    console.log("hello");
  });

  return <button id={btn}>Click Me</button>;
};
```

## Mount

### onMounted

Access Dom after render.

```jsx
const Foo = () => {
  const [text, Text] = useElement("h1");

  onMounted(() => {
    console.log(text.elem);

    // update text
    text.elem.innerText = "Foobarbaz";
  });

  return <Text>Foobar</Text>;
};
```

## License

[MIT](LICENSE)
