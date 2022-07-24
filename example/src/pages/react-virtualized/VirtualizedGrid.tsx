import { useState } from 'react';
import useInfinityScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import { createGridItems, createNextGrid } from '../../utils';
import ExampleCard from '../../components/ExampleCard';
import Item from '../../components/Item';
import { Grid } from 'react-virtualized';

const VirtualizedGrid = () => {
  const [data, setData] = useState(createGridItems(10, 10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
    left: false,
    right: true,
  });

  const ref = useInfinityScroll<Grid>({
    next: createNextGrid({ data, setData, setLoading, offset: 5 }),
    rowCount: data.length,
    columnCount: data[0].length,
    scrollThreshold: '100px',
    hasMore,
  });

  return (
    <ExampleCard title="Virtualized Grid" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
      {/* @ts-ignore */}
      <Grid
        ref={ref}
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
      />
    </ExampleCard>
  );
};

export default VirtualizedGrid;
