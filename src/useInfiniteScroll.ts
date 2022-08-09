import { useEffect, useRef } from 'react';
import { ElementRef, InfiniteScrollRef, UseInfiniteScrollProps } from './types';
import InfiniteScroll from './InfiniteScroll';

const useInfiniteScroll = (props: UseInfiniteScrollProps): InfiniteScrollRef<ElementRef> => {
  const containerRef = useRef<ElementRef | null>(null);
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
