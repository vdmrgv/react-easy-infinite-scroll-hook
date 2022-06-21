import { useEffect, useRef } from 'react';
import { UseInfiniteScrollResult, UseInfiniteScrollProps } from './types';
import InfiniteScroll from './InfiniteScroll';

const useInfiniteScroll = (props: UseInfiniteScrollProps): UseInfiniteScrollResult => {
  const {
    rowCount,
    columnCount,
    hasMore: { up, down, left, right },
  } = props;
  const {
    current: { setRef, onPropsChange, onCleanup },
  } = useRef<InfiniteScroll>(new InfiniteScroll(props));

  useEffect(() => onCleanup, []);
  useEffect(() => onPropsChange(props), [rowCount, columnCount, up, down, left, right]);

  return {
    setRef,
  };
};

export default useInfiniteScroll;
