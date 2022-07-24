import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import ExampleCard from '../../components/ExampleCard';
import { createItems, createNext } from '../../utils';
import Item from '../../components/Item';

const VerticalList = () => {
  const [data, setData] = useState(createItems());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
  });

  const ref = useInfiniteScroll<HTMLDivElement>({
    next: createNext({ setData, setLoading, offset: 50 }),
    rowCount: data.length,
    hasMore,
  });

  return (
    <ExampleCard title="Vertical List" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
      <div
        ref={ref}
        className="List"
        style={{
          height: '70vh',
          width: '60vw',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data.map((item, index) => (
          <Item key={item} className="Row" index={index} content={item} />
        ))}
      </div>
    </ExampleCard>
  );
};

export default VerticalList;
