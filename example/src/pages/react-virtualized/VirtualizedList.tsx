import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import ExampleCard from '../../components/ExampleCard';
import { createItems, createNext } from '../../utils';
import Item from '../../components/Item';
import { List } from 'react-virtualized';

const VirtualizedList = () => {
  const [data, setData] = useState(createItems());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
  });

  const ref = useInfiniteScroll<List>({
    next: createNext({ setData, setLoading, offset: 50 }),
    rowCount: data.length,
    hasMore,
  });

  return (
    <ExampleCard title="Virtualized List" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
      {/* @ts-ignore */}
      <List
        ref={ref}
        className="List"
        width={600}
        height={500}
        rowHeight={60}
        rowCount={data.length}
        rowRenderer={({ key, index, style }) => {
          const item = data[index];

          return <Item key={key} style={style} className="Row" index={index} content={item} />;
        }}
      />
    </ExampleCard>
  );
};

export default VirtualizedList;
