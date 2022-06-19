# react-easy-infinite-scroll-hook

![Test](https://github.com/vdmrgv/react-easy-infinite-scroll-hook/actions/workflows/test.yml/badge.svg)
[![GZipped size][npm-minzip-svg]][bundlephobia-url]
[![Version Badge][npm-version-svg]][package-url]
[![Downloads][downloads-image]][downloads-url]

A hook that will save you from endless scrolling problems! Infinite scrolling that really works and is very easy to integrate!
This hook allows you to create simple, lightweight components with infinite scrolling in all directions, supporting both windowed and scrollable elements.

## Features



- ⏬ **Universal** - Ability to use all types of scrollable elements or [react-virtualized](https://www.npmjs.com/package/react-virtualized) components
- 📦 **Support for all loading directions** - You can scroll the component indefinitely in the direction you want or all at once (`up`, `down`, `left`, `right`)
- 📏 **No need to specify heights** - No need to pass the dimensions of the component, scrollbar or element
- 💬 **Support for "chat history"** - Reverse mode includes
- ⚙️ **Matches native API** - Intuitive to use
- 🛠 **Written in TypeScript** - It'll fit right into your existing TypeScript
  project
- ✅ **Fully unit tested** - `100%` test coverage
- 🌳 **Tree-shakeable** - Only include the parts you use
- 💥 **Lightweight** - Around `~1.9kB`

## Install

```bash
  # with npm
  npm install --save react-easy-infinite-scroll-hook
  # with yarn
  yarn add react-easy-infinite-scroll-hook
```

## Usage

### Simple Example

[![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-6w9szb)

```js
import { useInfiniteScroll } from 'react-easy-infinite-scroll-hook';

const InfiniteListComponent = ({ isLoading, items, canLoadMore, next }) => {
  const { setRef } = useInfiniteScroll({
    next,
    rowLength: items.length,
    hasMore: { down: canLoadMore },
  });

  return (
    <div
      ref={setRef}
      style={{
        height: 500,
        overflowY: 'auto',
      }}
    >
      {items.map((item) => (
        <div key={item.key}>{item.value}</div>
      ))}
      {isLoading && <div>Loading...</div>}
    </div>
  );
};
```

### Virtualized Example (react-virtualized)

[![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-virtualized-mdfpyu)

```js
import { useInfiniteScroll } from 'react-easy-infinite-scroll-hook';
import { List } from 'react-virtualized';

const VirtualizedInfiniteListComponent = ({ isLoading, items, canLoadMore, next }) => {
  const { setRef } = useInfiniteScroll({
    next,
    rowLength: items.length,
    hasMore: { down: canLoadMore },
  });

  return (
    <List
      ref={setRef}
      width={500}
      height={500}
      rowHeight={60}
      rowCount={items.length}
      rowRenderer={({ key, index, style }) => {
        const item = data[index];

        return (
          <div key={key} style={style}>
            {item}
          </div>
        );
      }}
    />
  );
};
```

## API

After initialization, this hook returns a `setRef` function, which you must pass to your element `ref`.

### Props

| Name  | Required | Description | Type  | Default Value |
| ----- | -------- | ----------- | ----- | ------------- |
| next  | Yes      | A callback when more items are requested by the user. Receives a single parameter specifying the direction to load e.g. `(direction): Promise<void>` | Function | |
| hasMore | Yes | Whether there are more items to be loaded. Expect object with directions to load `{ up: false, down: false, left: false, right: false }`   | object | |
| rowLength | Condition | Number of items in a `vertical` list (scroll axis `Y`). Required if you are using `vertical` scroll. | number | |
| columnLength | Condition | Number of items in a `horizontal` list (scroll axis `X`). Required if you are using `horizontal` scroll. | number | |
| onScroll | | The callback is called when the container is scrolled: `({ clientHeight: number, scrollHeight: number, scrollTop: number, clientWidth: number, scrollWidth: number, scrollLeft: number }): void` | Function | |
| initialScroll | | The initial scroll position of the element, which is applied after the ref has been initialized | object | |
| reverse | | The direction of the scroll axis is used to create scrolling in the opposite direction, for example when using the CSS style `flex-direction: 'row-reverse'` | object | |
| scrollThreshold | | The threshold at which the next function is called. It can be specified in pixels from the scrollbar value, for example `'200px'` and as a percentage of the element value `0.6 = 60%` | number or string | 1 |

## Friends

- any DOM element with scroll
- [react-virtualized](https://www.npmjs.com/package/react-virtualized) components

## FAQ
1. Can I use it with `flex-direction: 'row-reverse'`?
- Yes, just pass `reverse: { vertical: true }` to the props.
## Troubleshooting
1. What should I do if I have an endless call `next` function?
- Try checking your element and make sure it has a fixed size (the size does not increase after receiving new data, only the size of the scrollbar increases) and the overflow can be scrolled in the right direction.

[package-url]: https://npmjs.org/package/react-easy-infinite-scroll-hook
[npm-version-svg]: https://img.shields.io/npm/v/react-easy-infinite-scroll-hook.svg
[npm-minzip-svg]:
  https://img.shields.io/bundlephobia/minzip/react-easy-infinite-scroll-hook.svg
[bundlephobia-url]:
  https://bundlephobia.com/result?p=react-easy-infinite-scroll-hook
[license-image]: http://img.shields.io/npm/l/react-easy-infinite-scroll-hook.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-easy-infinite-scroll-hook.svg
[downloads-url]:
  http://npm-stat.com/charts.html?package=react-easy-infinite-scroll-hook
