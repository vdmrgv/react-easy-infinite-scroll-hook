# react-easy-infinite-scroll-hook

[![Version Badge][npm-version-svg]][package-url]
![NPM license][license-image]
[![Stars][git-star-svg]][git-url]
![Test][test-svg]
[![GZipped size][npm-minzip-svg]][bundlephobia-url]
[![PRs Welcome][pr-svg]][pr-url]
[![Downloads][downloads-image]][downloads-url]
[![NPM total downloads][total-downloads-svg]][total-downloads-url]

A hook that will save you from endless scrolling problems! Infinite scrolling that really works and is very easy to integrate!<br />
This hook allows you to create simple, lightweight components with infinite scrolling in all directions, supporting both windowed and scrollable elements.<br />
<br />
Check out [the demo](https://vdmrgv.github.io/react-easy-infinite-scroll-hook) for some examples.

## Features

- ⏬ **Universal** - Ability to use all types of HTML elements or any UI or virtualized libraries
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
- 💥 **Lightweight** - Around `~2.4kB`
- 💨 **No dependencies**

## Install

```bash
  # with npm
  npm install --save react-easy-infinite-scroll-hook
  # with yarn
  yarn add react-easy-infinite-scroll-hook
```

## Usage

You can create infinite scrolling in `any direction` and in `any pair`, for example: `up-down`, `down-right`, `etc.` and even `all at once`.

### Simple Example

[![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-6w9szb)

```js
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';

const InfiniteListComponent = ({ isLoading, items, canLoadMore, next }) => {
  // TypeScript example:
  // const ref = useInfiniteScroll<YourElemntType>(...props);
  const ref = useInfiniteScroll({
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
      ref={ref}
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

This hook supports all [react-virtualized](https://www.npmjs.com/package/react-virtualized) components (`Collection`, `Grid`, `MultiGrid`, `List`, `Masonry`, `Table`). Check out [the demo](https://vdmrgv.github.io/react-easy-infinite-scroll-hook) for more examples.

Try it live:

| Component | Description                                                          |                                                                                          Link                                                                                           |
| :-------: | -------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   List    | Virtualized `List` component with infinite scroll                    |            [![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-virtualized-mdfpyu)             |
|   Grid    | Virtualized `Grid` component with infinite scroll `down` and `right` | [![Edit useInfiniteScroll](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-easy-infinite-scroll-hook-virtualized-grid-rlmfd9?file=/src/App.tsx) |

<br />

```js
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';
import { List } from 'react-virtualized';

const VirtualizedInfiniteListComponent = ({ isLoading, items, canLoadMore, next }) => {
  const ref = useInfiniteScroll({
    next,
    rowCount: items.length,
    hasMore: { down: canLoadMore },
  });

  return (
    <div>
      <List
        ref={ref}
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

After initialization, this hook returns a React `ref` object, which you must pass to your element `ref`.

### Props

| Name            | Required  | Description                                                                                                                                                                                                                                  | Type             | Default Value |
| --------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | :-----------: |
| next            | Yes       | A callback when more items are requested by the user. Receives a single parameter specifying the direction to load e.g. `(direction) => Promise<void>`                                                                                       | Function         |               |
| hasMore         | Yes       | Whether there are more items to load. If marked `true` in the specified direction, it will try to load more items if the threshold is reached. Expect object with directions to load `{ up: false, down: false, left: false, right: false }` | object           |               |
| rowCount        | Condition | Number of items in a `vertical` list (scroll axis `Y`). Required if you are using `vertical` scroll.                                                                                                                                         | number           |               |
| columnCount     | Condition | Number of items in a `horizontal` list (scroll axis `X`). Required if you are using `horizontal` scroll.                                                                                                                                     | number           |               |
| onScroll        |           | The callback is called when the container is scrolled: `({ clientHeight: number, scrollHeight: number, scrollTop: number, clientWidth: number, scrollWidth: number, scrollLeft: number }) => void`                                           | Function         |               |
| initialScroll   |           | The initial scroll position of the element, which is applied after the ref has been initialized                                                                                                                                              | object           |               |
| reverse         |           | The direction of the scroll axis is used to create scrolling in the opposite direction, for example when using the CSS style `flex-direction: 'row-reverse'`                                                                                 | object           |               |
| scrollThreshold |           | The threshold at which the next function is called. It can be specified in pixels from the scrollbar value, for example `'200px'` and as a percentage of the container size `from 0.1 to 1` (`1` is `100%`)                                  | number or string |      `1`      |
| windowScroll    |           | When set to `true`, uses a window as the scroll element. If you are using a scroll window, then anything you pass to the `ref` will be ignored                                                                                               | boolean          |    `false`    |

## Supported Browsers
`react-easy-infinite-scroll-hook` aims to support all evergreen browsers and recent mobile browsers for iOS and Android. IE 9+ is also supported.

If you find a browser-specific problem, please report it.

## Friends

- Any DOM element with scroll
- [react-virtualized](https://www.npmjs.com/package/react-virtualized) components
- [@tanstack/virtual-core](https://www.npmjs.com/package/@tanstack/virtual-core)

## FAQ

### Can I use it with other virtualized or components libraries?

> Yes you can! To use it with other libraries you must specify the correct DOM element for the `ref` object.

### Can I use it with `flex-direction: 'column-reverse'`?

> Yes, just pass `reverse: { column: true }` to props for `flex-direction: 'column-reverse'` or `reverse: { row: true }` for `flex-direction: 'row-reverse'`.

### How to use it with `react-virtualized` `MultiGrid` component?

> `MultiGrid` is a complex component with a lot of scrollable containers, and to use it you must specify the correct container for the `ref` object:

```js
import React, { useCallback } from 'react';
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';
import { MultiGrid } from 'react-virtualized';

const VirtualizedInfiniteMultiGridComponent = ({ isLoading, items, canLoadMore, next }) => {
  const ref = useInfiniteScroll({
    next,
    columnCount: items.length,
    hasMore: { right: canLoadMore },
  });

  // Use `useCallback` so we don't recreate the function on each render - Could result in infinite loop
  const selectRef = useCallback(
    (node) => {
      ref.current = node?._bottomRightGrid;
    },
    [ref]
  );

  return (
    <div>
      <MultiGrid ref={selectRef} {...props} />
      {isLoading && <div>Loading...</div>}
    </div>
  );
};
```

### How to use it with `react-window`?

> `react-easy-infinite-scroll-hook` works with any DOM element, so just specify the correct container for the `ref` object:

```js
import React, { useCallback } from 'react';
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';
import { FixedSizeList } from 'react-window';

const Component = ({ isLoading, items, canLoadMore, next }) => {
  const ref = useInfiniteScroll({
    next,
    columnCount: items.length,
    hasMore: { right: canLoadMore },
  });

  // Use `useCallback` so we don't recreate the function on each render - Could result in infinite loop
  const setRef = useCallback((node) => {
    if(node)
      ref.current=node._outerRef
  }, []);
  
  return (
    <FixedSizeList
      ref={setRef}
      className="List"
      width={600}
      height={500}
      itemSize={60}
      itemCount={items.length}
    >
      {Row}
    </FixedSizeList>);
};
```

## Contributing

Please read through our [contributing guidelines](https://github.com/vdmrgv/react-easy-infinite-scroll-hook/blob/main/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

## License

Code released under the [MIT License][license-url] © [Vadim Rogov](https://github.com/vdmrgv).

[package-url]: https://npmjs.org/package/react-easy-infinite-scroll-hook
[npm-version-svg]: https://img.shields.io/npm/v/react-easy-infinite-scroll-hook.svg
[npm-version-svg]: https://img.shields.io/npm/v/react-easy-infinite-scroll-hook.svg
[npm-minzip-svg]: https://img.shields.io/bundlephobia/minzip/react-easy-infinite-scroll-hook.svg
[bundlephobia-url]: https://bundlephobia.com/result?p=react-easy-infinite-scroll-hook
[license-image]: https://img.shields.io/npm/l/react-easy-infinite-scroll-hook.svg?style=flat
[license-url]: LICENSE
[git-url]: https://github.com/vdmrgv/react-easy-infinite-scroll-hook
[git-star-svg]: https://img.shields.io/github/stars/vdmrgv/react-easy-infinite-scroll-hook
[pr-svg]: https://badgen.net/badge/PRs/welcome/cyan
[pr-url]: http://makeapullrequest.com
[downloads-image]: http://img.shields.io/npm/dm/react-easy-infinite-scroll-hook.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-easy-infinite-scroll-hook
[test-svg]: https://github.com/vdmrgv/react-easy-infinite-scroll-hook/actions/workflows/test.yml/badge.svg
[total-downloads-svg]: https://img.shields.io/npm/dt/react-easy-infinite-scroll-hook.svg?style=flat
[total-downloads-url]: https://npmcharts.com/compare/react-easy-infinite-scroll-hook?minimal=true

