import { useEffect, useRef } from 'react';
import { InfiniteScroll, InfiniteScrollProps, InfiniteScrollRef } from './InfiniteScroll';

const useInfiniteScroll = <T>(props: InfiniteScrollProps): InfiniteScrollRef<T> => {
  const containerRef = useRef<any>(null);
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

  useEffect(() => {
    setRef(windowScroll ? null : containerRef.current);

    return onCleanup;
  }, [containerRef.current]);

  useEffect(() => onPropsChange(props), [rowCount, columnCount, up, down, left, right, next]);

  return containerRef;
};

export default useInfiniteScroll;
