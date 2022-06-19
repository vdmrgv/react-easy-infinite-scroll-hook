# react-easy-infinite-scroll-hook

A hook that will save you from endless scrolling problems! Infinite scrolling that really works and is very easy to integrate!
This hook allows you to create a simple, lightweight components with infinite scrolling, supporting both windowed and scrollable elements.

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
- 💥 **Lightweight** - Around `~1.5kB`

## Install

```bash
  # with npm
  npm install --save react-easy-infinite-scroll-hook
  # with yarn
  yarn add react-easy-infinite-scroll-hook
```

## Usage

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

## API

After initialization, this hook returns a `setRef` function, which you must pass to your element, for example: `<div ref={setRef}>...</div>`.

### Props

| Name            | Required | Description                                                                                                                                                                            | Type     | Default Value |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- | ------------------------ | -------- | --- |
| next            | Yes      | A callback when more items are requested by the user. Receives a single parameter specifying the direction to load e.g. `(direction: 'up'                                              | 'down'   | 'left'        | 'rigth'): Promise<void>` | Function |     |
| hasMore         | Yes      | Whether there are more items to be loaded. Expect object with directions to load `{ [k: 'up'                                                                                           | 'down'   | 'left'        | 'right']: boolean }`     | object   |     |
| rowLength       |          | Number of items in a `vertical` list (scroll axis `Y`)                                                                                                                                 | number   |               |
| columnLength    |          | Number of items in a `horizontal` list (scroll axis `X`)                                                                                                                               | number   |               |
| onScroll        |          | The callback is called when the container is scrolled: `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void`                                                     | Function |               |
| initialScroll   |          | The initial scroll position of the element, which is applied after the ref has been initialized                                                                                        | object   |               |
| reverse         |          | The direction of the scroll axis is used to create scrolling in the opposite direction, for example when using the CSS style `flex-direction: 'row-reverse'`                           | object   |               |
| scrollThreshold |          | The threshold at which the next function is called. It can be specified in pixels from the scrollbar value, for example `'200px'` and as a percentage of the element value `0.6 = 60%` | number   | string        | 1                        |

## Friends

- any DOM element with scroll
- [react-virtualized](https://www.npmjs.com/package/react-virtualized) components

## FAQ

## Troubleshooting
