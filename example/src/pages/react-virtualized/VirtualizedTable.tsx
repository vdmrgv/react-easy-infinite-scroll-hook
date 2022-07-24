import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import ExampleCard from '../../components/ExampleCard';
import { createGridItems, createNextGrid } from '../../utils';
import { Table, Column } from 'react-virtualized';

const VirtualizedTable = () => {
  const [data, setData] = useState(createGridItems(20, 4));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
  });

  const ref = useInfiniteScroll<Table>({
    next: createNextGrid({ data, setData, setLoading, offset: 10 }),
    rowCount: data.length,
    hasMore,
  });

  return (
    <ExampleCard title="Virtualized Table" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
      {/* @ts-ignore */}
      <Table
        ref={ref}
        className="List"
        disableHeader={false}
        width={600}
        height={500}
        overscanRowCount={3}
        headerClassName="VirtualizedTable-header"
        rowClassName="VirtualizedTable-row"
        headerHeight={60}
        rowHeight={60}
        rowGetter={({ index }) => data[index]}
        rowCount={data.length}
      >
        {/* @ts-ignore */}
        {data[0].map((_, index) => (
          <Column key={`Cell-${index}`} label={`Column ${index + 1}`} dataKey={index} width={140} />
        ))}
      </Table>
    </ExampleCard>
  );
};

export default VirtualizedTable;
