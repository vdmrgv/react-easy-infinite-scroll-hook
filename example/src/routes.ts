import {
  VerticalList,
  HorizontalList,
  WindowList,
  ReversedVerticalList,
  ReversedHorizontalList,
  Grid,
  Table,
  VirtualizedList,
  VirtualizedGrid,
  VirtualizedMultiGrid,
  VirtualizedTable,
} from './pages';

const appTree = [
  {
    name: 'Common',
    path: '/common',
    subs: [
      {
        name: 'Vertical List',
        path: '/vertival-list',
        Component: VerticalList,
      },
      {
        name: 'Horizontal List',
        path: '/horizontal-list',
        Component: HorizontalList,
      },
      {
        name: 'Window List',
        path: '/window-list',
        Component: WindowList,
      },
      {
        name: 'Reversed Vertical List',
        path: '/reversed-vertival-list',
        Component: ReversedVerticalList,
      },
      {
        name: 'Reversed Horizontal List',
        path: '/reversed-horizontal-list',
        Component: ReversedHorizontalList,
      },
      {
        name: 'Grid',
        path: '/grid',
        Component: Grid,
      },
      {
        name: 'Table',
        path: '/table',
        Component: Table,
      },
    ],
  },
  {
    name: 'react-virtualized',
    path: '/react-virtualized',
    subs: [
      {
        name: 'List',
        path: '/list',
        Component: VirtualizedList,
      },
      {
        name: 'Grid',
        path: '/grid',
        Component: VirtualizedGrid,
      },
      {
        name: 'MultiGrid',
        path: '/multi-grid',
        Component: VirtualizedMultiGrid,
      },
      {
        name: 'Table',
        path: '/table',
        Component: VirtualizedTable,
      },
      // {
      //   name: 'Collection',
      //   path: '/collection',
      //   Component: VerticalCollection,
      // },
      // {
      //   name: 'Masonry',
      //   path: '/masonry',
      //   Component: VirtualizedMasonry,
      // },
    ],
  },
];

export const routes = appTree.reduce((acc, tree) => {
  return [
    ...acc,
    ...tree.subs.map(({ path, Component }) => ({
      path: `${tree.path}${path}`,
      Component,
    })),
  ];
}, [] as { path: string; Component: () => JSX.Element }[]);

export const sidebarNavs = appTree.map((tree) => ({
  ...tree,
  subs: tree.subs.map(({ path, name }) => ({ path, name })),
}));
