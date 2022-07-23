import { useEffect, useLayoutEffect, useRef } from 'react';
import { UseInfiniteScrollResult, UseInfiniteScrollProps } from './types';
import InfiniteScroll from './InfiniteScroll';

const useInfiniteScroll = (props: UseInfiniteScrollProps): UseInfiniteScrollResult => {
  const mounted = useRef(false);
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
    mounted.current = true;

    if (windowScroll) setRef(null);

    return () => {
      if (mounted.current) onCleanup();
    };
  }, []);

  useEffect(() => onPropsChange(props), [rowCount, columnCount, up, down, left, right, next]);

  return {
    setRef,
  };
};

export default useInfiniteScroll;
