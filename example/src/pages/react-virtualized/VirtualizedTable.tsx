import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionBooleanState } from 'react-easy-infinite-scroll-hook';
import ExampleCard from '../../components/ExampleCard';
import { createGridItems, createNextGrid, getSourceUrl } from '../../utils';
import { Table, Column } from 'react-virtualized';

const VirtualizedTable = () => {
  const [data, setData] = useState(createGridItems(100, 4));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionBooleanState>({
    up: false,
    down: true,
  });

  const ref = useInfiniteScroll<Table>({
    next: createNextGrid({ data, setData, setLoading, offset: 30 }),
    rowCount: data.length,
    hasMore,
  });

  return (
    <ExampleCard
      title="Virtualized Table"
      hasMore={hasMore}
      onChangeHasMore={setHasMore}
      loading={loading}
      source={getSourceUrl('VirtualizedTable', 'react-virtualized')}
    >
      {/* @ts-ignore */}
      <Table
        ref={ref}
        className="VirtualizedTable"
        disableHeader={false}
        width={600}
        height={500}
        overscanRowCount={5}
        headerClassName="VirtualizedTable-header"
        rowClassName="VirtualizedTable-row"
        headerHeight={60}
        rowHeight={60}
        rowGetter={({ index }) => data[index].cells}
        rowCount={data.length}
      >
        {data[0].cells.map((_, index) => {
          // @ts-ignore
          return <Column key={`Cell-${index}`} label={`Column ${index + 1}`} dataKey={index} width={140} />;
        })}
      </Table>
    </ExampleCard>
  );
};

export default VirtualizedTable;
