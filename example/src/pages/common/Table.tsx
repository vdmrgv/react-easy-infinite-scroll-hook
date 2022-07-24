import { useState } from 'react';
import useInfinityScroll, { ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import MaterialTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { createGridItems, createNextGrid } from '../../utils';
import ExampleCard from '../../components/ExampleCard';

const Table = () => {
  const [data, setData] = useState(createGridItems(15, 8));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<ScrollDirectionState>({
    up: false,
    down: true,
    left: false,
    right: true,
  });

  const ref = useInfinityScroll<HTMLTableElement>({
    next: createNextGrid({ data, setData, setLoading, offset: 6 }),
    rowCount: data.length,
    columnCount: data[0].length,
    scrollThreshold: '100px',
    hasMore,
  });

  return (
    <ExampleCard title="Table" hasMore={hasMore} onChangeHasMore={setHasMore} loading={loading}>
      <TableContainer ref={ref} className="Table" sx={{ maxWidth: 500, maxHeight: 500, overflow: 'auto' }}>
        <MaterialTable sx={{ minWidth: 350 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {data[0].map((cell, index) => (
                <TableCell key={`tablehead-${cell}`} align="right">
                  {index}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ maxHeight: 600, overflow: 'auto' }}>
            {data.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {row.map((cell) => (
                  <TableCell key={cell} align="right">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MaterialTable>
      </TableContainer>
    </ExampleCard>
  );
};

export default Table;
