import { useEffect, useLayoutEffect, useRef } from 'react';
import { UseInfiniteScrollResult, UseInfiniteScrollProps } from './types';
import InfiniteScroll from './InfiniteScroll';

const useInfiniteScroll = (props: UseInfiniteScrollProps): UseInfiniteScrollResult => {
  const {
    rowCount,
    columnCount,
    hasMore: { up, down, left, right },
    next,
    windowScroll,
  } = props;
  const {
    current: { setRef, onPropsChange, onCleanup },
  } = useRef<InfiniteScroll>(new InfiniteScroll(props));

  useLayoutEffect(() => {
    if (windowScroll) setRef(null);

    // do cleanup for document events only
    return windowScroll ? onCleanup : undefined;
  }, []);

  useEffect(() => onPropsChange(props), [rowCount, columnCount, up, down, left, right, next]);

  return {
    setRef,
  };
};

export default useInfiniteScroll;
