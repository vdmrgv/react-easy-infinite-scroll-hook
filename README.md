# react-easy-infinite-scroll-hook

[![Version Badge][npm-version-svg]][package-url]
![NPM license](https://img.shields.io/npm/l/react-easy-infinite-scroll-hook.svg?style=flat)
![Test](https://github.com/vdmrgv/react-easy-infinite-scroll-hook/actions/workflows/test.yml/badge.svg)
[![GZipped size][npm-minzip-svg]][bundlephobia-url]
[![PRs Welcome](https://badgen.net/badge/PRs/welcome/cyan)](http://makeapullrequest.com)
[![NPM total downloads](https://img.shields.io/npm/dt/react-easy-infinite-scroll-hook.svg?style=flat)](https://npmcharts.com/compare/react-easy-infinite-scroll-hook?minimal=true)
[![Downloads][downloads-image]][downloads-url]

A hook that will save you from endless scrolling problems! Infinite scrolling that really works and is very easy to integrate!
This hook allows you to create simple, lightweight components with infinite scrolling in all directions, supporting both windowed and scrollable elements.

## Features

- ⏬ **Universal** - Ability to use all types of scrollable elements or any [react-virtualized](https://www.npmjs.com/package/react-virtualized) components
- 📦 **Support for all loading directions** - You can infinitely scroll a component in any direction or in all directions at once (`up`, `down`, `left`, `right`)
- 📏 **No need to specify heights** - No need to pass the dimensions of the component, scrollbar or element
- 💬 **Support for "chat history"** - Reverse mode includes
- 👫 **Cross-browser** - Works out-of-the-box for most browsers, regardless of version.
- ⚙️ **Matches native API** - Intuitive to use
- 🛠 **Written in TypeScript** - It'll fit right into your existing TypeScript
  project
- 📲 **Mobile-friendly** - Supports mobile devices and touch screens.
- ✅ **Fully unit tested** - `100%` test coverage
- 🌳 **Tree-shakeable** - Only include the parts you use
- 💥 **Lightweight** - Around `~2kB`
- 💨 **No dependencies**

## Install

```bash
  # with npm
  npm install --save react-easy-infinite-scroll-hook
  # with yarn
  yarn add react-easy-infinite-scroll-hook
```

## Usage

You can create infinite scrolling in any direction and in any pair, for example: `up-down`, `down-right`, `etc.` and even `all` at once.

### Simple Example

[![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-6w9szb)

```js
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';

const InfiniteListComponent = ({ isLoading, items, canLoadMore, next }) => {
  const { setRef } = useInfiniteScroll({
    // Function to fetch more items
    next,
    // The number of items loaded if you use the "Y-scroll" axis ("up" and "down")
    // if you are using the "X-scroll" axis ("left" and "right") use "columnCount" instead
    // you can also use "rowCount" and "columnCount" if you use "Y-scroll" and "X-scroll" at the same time
    rowCount: items.length,
    // Whether there are more items to load
    // if marked "true" in the specified direction, it will try to load more items if the threshold is reached
    // support for all directions "up", "down", "left", "right", both individually and in all directions at the same time
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

This hook supports all [react-virtualized](https://www.npmjs.com/package/react-virtualized) components (`Collection`, `Grid`, `MultiGrid`, `List`, `Masonry`, `Table`).

Try it live:

| Component | Description | Link |
| :--: | -- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| List | Virtualized `List` component with infinite scroll | [![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-virtualized-mdfpyu)             |
| Grid | Virtualized `Grid` component with infinite scroll `down` and `right` | [![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-virtualized-grid-rlmfd9?file=/src/App.tsx) |

<br />

```js
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';
import { List } from 'react-virtualized';

const VirtualizedInfiniteListComponent = ({ isLoading, items, canLoadMore, next }) => {
  const { setRef } = useInfiniteScroll({
    next,
    rowCount: items.length,
    hasMore: { down: canLoadMore },
  });

  return (
    <div>
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
      {isLoading && <div>Loading...</div>}
    </div>
  );
};
```

## API

After initialization, this hook returns a `setRef` function, which you must pass to your element `ref`.

### Props

| Name            | Required  | Description                                                                                                                                                                                                 | Type             | Default Value |
| --------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------- |
| next            | Yes       | A callback when more items are requested by the user. Receives a single parameter specifying the direction to load e.g. `(direction) => Promise<void>`                                                      | Function         |               |
| hasMore         | Yes       | Whether there are more items to load. If marked `true` in the specified direction, it will try to load more items if the threshold is reached. Expect object with directions to load `{ up: false, down: false, left: false, right: false }`      | object           |               |
| rowCount        | Condition | Number of items in a `vertical` list (scroll axis `Y`). Required if you are using `vertical` scroll.                                                                                                        | number           |               |
| columnCount     | Condition | Number of items in a `horizontal` list (scroll axis `X`). Required if you are using `horizontal` scroll.                                                                                                    | number           |               |
| onScroll        |           | The callback is called when the container is scrolled: `({ clientHeight: number, scrollHeight: number, scrollTop: number, clientWidth: number, scrollWidth: number, scrollLeft: number }) => void`          | Function         |               |
| initialScroll   |           | The initial scroll position of the element, which is applied after the ref has been initialized                                                                                                             | object           |               |
| reverse         |           | The direction of the scroll axis is used to create scrolling in the opposite direction, for example when using the CSS style `flex-direction: 'row-reverse'`                                                | object           |               |
| scrollThreshold |           | The threshold at which the next function is called. It can be specified in pixels from the scrollbar value, for example `'200px'` and as a percentage of the container size `from 0.1 to 1` (`1` is `100%`) | number or string | 1             |

## Friends

- Any DOM element with scroll
- [react-virtualized](https://www.npmjs.com/package/react-virtualized) components

## FAQ

### Can I use it with `flex-direction: 'column-reverse'`?

> Yes, just pass `reverse: { column: true }` to props for `flex-direction: 'column-reverse'` or `reverse: { row: true }` for `flex-direction: 'row-reverse'`.

### How to use it with `react-virtualized` `MultiGrid` component?

> `MultiGrid` is a complex component with a lot of scrollable containers, and to use it you must specify the correct container for the `setRef` function:

```js
import React, { useCallback } from 'react';
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';
import { MultiGrid } from 'react-virtualized';

const VirtualizedInfiniteMultiGridComponent = ({ isLoading, items, canLoadMore, next }) => {
  const { setRef } = useInfiniteScroll({
    next,
    columnCount: items.length,
    hasMore: { right: canLoadMore },
  });

  // Use `useCallback` so we don't recreate the function on each render - Could result in infinite loop
  const selectRef = useCallback(
    (node) => {
      setRef(node._bottomRightGrid);
    },
    [setRef]
  );

  return (
    <div>
      <MultiGrid ref={selectRef} {...props} />
      {isLoading && <div>Loading...</div>}
    </div>
  );
};
```

## Contributions

Learn how to [contribute](https://github.com/vdmrgv/react-easy-infinite-scroll-hook/blob/main/CONTRIBUTING.md)

## License

[MIT](https://github.com/vdmrgv/react-easy-infinite-scroll-hook/blob/main/LICENSE) © [vdmrgv](https://github.com/vdmrgv)

[package-url]: https://npmjs.org/package/react-easy-infinite-scroll-hook
[npm-version-svg]: https://img.shields.io/npm/v/react-easy-infinite-scroll-hook.svg
[npm-minzip-svg]: https://img.shields.io/bundlephobia/minzip/react-easy-infinite-scroll-hook.svg
[bundlephobia-url]: https://bundlephobia.com/result?p=react-easy-infinite-scroll-hook
[license-image]: http://img.shields.io/npm/l/react-easy-infinite-scroll-hook.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-easy-infinite-scroll-hook.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-easy-infinite-scroll-hook
