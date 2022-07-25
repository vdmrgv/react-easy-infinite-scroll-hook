import { useState } from 'react';
import useInfiniteScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import { createGridItems, createNextGrid, getSourceUrl } from '../../utils';
import ExampleCard from '../../components/ExampleCard';
import Item from '../../components/Item';

const Grid = () => {
  const [data, setData] = useState(createGridItems(17, 17));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
    left: false,
    right: true,
  });

  const ref = useInfiniteScroll<HTMLDivElement>({
    next: createNextGrid({ data, setData, setLoading, offset: 8 }),
    rowCount: data.length,
    columnCount: data[0].cells.length,
    scrollThreshold: '300px',
    hasMore,
  });

  return (
    <ExampleCard
      title="Grid"
      hasMore={hasMore}
      onChangeHasMore={setHasMore}
      loading={loading}
      source={getSourceUrl('Grid')}
    >
      <div
        ref={ref}
        className="Grid"
        style={{
          height: '40vh',
          width: '40vw',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data.map((row, rowIndex) => (
          <div key={`row-${row.key}`} className="Grid-row">
            {row.cells.map((cell, cellIndex) => (
              <Item key={cell} index={`${rowIndex}-${cellIndex}`} className="Cell" content={cell} />
            ))}
          </div>
        ))}
      </div>
    </ExampleCard>
  );
};

export default Grid;
