import { v4 as uuidv4 } from 'uuid';
import { ScrollDirection } from 'react-easy-infinite-scroll-hook';

export const createItems = (length = 100): string[] => Array.from({ length }).map(() => uuidv4());

export const loadMore = async (length = 50): Promise<string[]> =>
  new Promise((res) => setTimeout(() => res(createItems(length)), 100));

export const createNext =
  ({
    setLoading,
    setData,
    offset,
    reverse,
  }: {
    setData: (v: React.SetStateAction<string[]>) => void;
    setLoading: (v: React.SetStateAction<boolean>) => void;
    offset: number;
    reverse?: boolean;
  }) =>
  async (direction: ScrollDirection) => {
    try {
      setLoading(true);
      const rows = await loadMore(offset);

      setData((prev) =>
        direction === 'up' || direction === 'left'
          ? reverse
            ? [...prev, ...rows]
            : [...rows, ...prev]
          : reverse
          ? [...rows, ...prev]
          : [...prev, ...rows]
      );
    } finally {
      setLoading(false);
    }
  };

interface Row {
  key: string;
  cells: string[];
}

export const createGridItems = (rows = 100, columns = 100): Row[] =>
  Array.from({ length: rows }).map(() => ({
    key: uuidv4(),
    cells: Array.from({ length: columns }).map(() => uuidv4()),
  }));

export const loadMoreGridItems = async (rows = 20, columns = 20): Promise<Row[]> =>
  new Promise((res) => setTimeout(() => res(createGridItems(rows, columns)), 100));

export const createNextGrid =
  ({
    data,
    setLoading,
    setData,
    offset,
  }: {
    data: Row[];
    setData: (v: React.SetStateAction<Row[]>) => void;
    setLoading: (v: React.SetStateAction<boolean>) => void;
    offset: number;
  }) =>
  async (direction: ScrollDirection) => {
    try {
      setLoading(true);
      if (direction === 'up' || direction === 'down') {
        const rows = await loadMoreGridItems(offset, data[0].cells.length);

        setData((prev) => (direction === 'up' ? [...rows, ...prev] : [...prev, ...rows]));
      } else {
        const rowColumns = await loadMoreGridItems(data.length, offset);

        setData((prev) =>
          prev.map((row, idx) => ({
            key: row.key,
            cells:
              direction === 'left'
                ? [...rowColumns[idx].cells, ...row.cells]
                : [...row.cells, ...rowColumns[idx].cells],
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

export const getSourceUrl = (componentName: string) =>
  `https://github.com/vdmrgv/react-easy-infinite-scroll-hook/blob/main/example/src/pages/common/${componentName}.tsx`;
