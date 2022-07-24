import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import ExampleCard from '../../components/ExampleCard';
import { createItems, createNext, getSourceUrl } from '../../utils';
import Item from '../../components/Item';

const WindowList = () => {
  const [data, setData] = useState(createItems());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
  });

  useInfiniteScroll<HTMLDivElement>({
    next: createNext({ setData, setLoading, offset: 50 }),
    rowCount: data.length,
    hasMore,
    windowScroll: true,
  });

  return (
    <ExampleCard
      title="Window List"
      hasMore={hasMore}
      onChangeHasMore={setHasMore}
      loading={loading}
      source={getSourceUrl('WindowList')}
    >
      <div
        className="List"
        style={{
          width: '60vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data.map((item, index) => (
          <Item key={item} index={index} className="Row" content={item} />
        ))}
      </div>
    </ExampleCard>
  );
};

export default WindowList;
