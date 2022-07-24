import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import ExampleCard from '../../components/ExampleCard';
import { createItems, createNext } from '../../utils';
import Item from '../../components/Item';

const HorizontalList = () => {
  const [data, setData] = useState(createItems());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    left: false,
    right: true,
  });

  const ref = useInfiniteScroll<HTMLDivElement>({
    next: createNext({ setData, setLoading, offset: 50 }),
    columnCount: data.length,
    hasMore,
  });

  return (
    <ExampleCard title="Horizontal List" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
      <div
        ref={ref}
        className="List"
        style={{
          height: '50vh',
          width: '70vw',
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {data.map((item, index) => (
          <Item key={item} index={index} className="Column" content={item} />
        ))}
      </div>
    </ExampleCard>
  );
};

export default HorizontalList;
