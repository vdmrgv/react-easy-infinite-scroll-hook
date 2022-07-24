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

export const createGridItems = (rows = 100, columns = 100): string[][] =>
  Array.from({ length: rows }).map(() => Array.from({ length: columns }).map(() => uuidv4()));

export const loadMoreGridItems = async (rows = 20, columns = 20): Promise<string[][]> =>
  new Promise((res) => setTimeout(() => res(createGridItems(rows, columns)), 100));

export const createNextGrid =
  ({
    data,
    setLoading,
    setData,
    offset,
  }: {
    data: string[][];
    setData: (v: React.SetStateAction<string[][]>) => void;
    setLoading: (v: React.SetStateAction<boolean>) => void;
    offset: number;
  }) =>
  async (direction: ScrollDirection) => {
    try {
      setLoading(true);
      if (direction === 'up' || direction === 'down') {
        const rows = await loadMoreGridItems(offset, data[0].length);

        setData((prev) => (direction === 'up' ? [...rows, ...prev] : [...prev, ...rows]));
      } else {
        const rowColumns = await loadMoreGridItems(data.length, offset);

        setData((prev) =>
          prev.map((row, idx) => (direction === 'left' ? [...rowColumns[idx], ...row] : [...row, ...rowColumns[idx]]))
        );
      }
    } finally {
      setLoading(false);
    }
  };
