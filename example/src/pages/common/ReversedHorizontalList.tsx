import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionBooleanState } from 'react-easy-infinite-scroll-hook';
import ExampleCard from '../../components/ExampleCard';
import { createItems, createNext, getSourceUrl } from '../../utils';
import Item from '../../components/Item';

const ReversedHorizontalList = () => {
  const [data, setData] = useState(createItems());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionBooleanState>({
    left: true,
    right: false,
  });

  const ref = useInfiniteScroll<HTMLDivElement>({
    next: createNext({ setData, setLoading, offset: 50, reverse: true }),
    columnCount: data.length,
    hasMore,
    reverse: { row: true },
  });

  return (
    <ExampleCard
      title="Reversed Horizontal List"
      hasMore={hasMore}
      onChangeHasMore={setHasMore}
      loading={loading}
      source={getSourceUrl('ReversedHorizontalList')}
    >
      <div
        ref={ref}
        className="List"
        style={{
          height: '50vh',
          width: '70vw',
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'row-reverse',
        }}
      >
        {data.map((item, index) => (
          <Item key={item} index={index} className="Column-reverse" content={item} />
        ))}
      </div>
    </ExampleCard>
  );
};

export default ReversedHorizontalList;
