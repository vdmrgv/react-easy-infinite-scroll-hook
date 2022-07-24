import { useState } from 'react';
import useInfinityScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import { createGridItems, createNextGrid } from '../../utils';
import ExampleCard from '../../components/ExampleCard';
import Item from '../../components/Item';

const Grid = () => {
  const [data, setData] = useState(createGridItems(6, 6));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
    left: false,
    right: true,
  });

  const ref = useInfinityScroll<HTMLDivElement>({
    next: createNextGrid({ data, setData, setLoading, offset: 3 }),
    rowCount: data.length,
    columnCount: data[0].length,
    scrollThreshold: '100px',
    hasMore,
  });

  return (
    <ExampleCard title="Grid" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
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
          <div key={`row-${rowIndex}`} className="Grid-row">
            {row.map((column, columnIndex) => (
              <Item key={column} index={`${rowIndex}-${columnIndex}`} className="Cell" content={column} />
            ))}
          </div>
        ))}
      </div>
    </ExampleCard>
  );
};

export default Grid;
