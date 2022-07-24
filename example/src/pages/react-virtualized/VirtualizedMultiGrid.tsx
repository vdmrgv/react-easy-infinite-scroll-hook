import { useCallback, useState } from 'react';
import useInfinityScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import { createGridItems, createNextGrid } from '../../utils';
import ExampleCard from '../../components/ExampleCard';
import Item from '../../components/Item';
import { MultiGrid } from 'react-virtualized';

const STYLE = {
  border: '1px solid gray',
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid gray',
  backgroundColor: '#f7f7f7',
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid gray',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};

const VirtualizedMultiGrid = () => {
  const [data, setData] = useState(createGridItems(10, 10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
    left: false,
    right: true,
  });

  const ref = useInfinityScroll<MultiGrid>({
    next: createNextGrid({ data, setData, setLoading, offset: 5 }),
    rowCount: data.length,
    columnCount: data[0].length,
    scrollThreshold: '100px',
    hasMore,
  });

  const selectRef = useCallback(
    (node: any) => {
      if (node) ref.current = node._bottomRightGrid;
    },
    [ref]
  );

  return (
    <ExampleCard title="Virtualized MultiGrid" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
      {/* @ts-ignore */}
      <MultiGrid
        ref={selectRef}
        className="Grid"
        cellRenderer={({ columnIndex, key, rowIndex, style }) => {
          const item = data[rowIndex][columnIndex];

          return <Item key={key} style={style} index={`${rowIndex}-${columnIndex}`} className="Cell" content={item} />;
        }}
        height={400}
        width={600}
        rowHeight={135}
        columnWidth={135}
        rowCount={data.length}
        columnCount={data[0].length}
        enableFixedColumnScroll
        enableFixedRowScroll
        hideTopRightGridScrollbar
        hideBottomLeftGridScrollbar
        fixedColumnCount={1}
        style={STYLE}
        styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
        styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
        styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
      />
    </ExampleCard>
  );
};

export default VirtualizedMultiGrid;
