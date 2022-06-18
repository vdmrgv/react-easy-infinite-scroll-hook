import { renderHook, RenderHookResult } from '@testing-library/react';
import { UseInfiniteScrollProps, ScrollingContainerRef } from '../types';
import useInfiniteScroll from '../useInfiniteScroll';
import { createContainer, createInfiniteScrollProps } from './utils';

describe('useInfiniteScroll', () => {
  let infiniteScrollProps = createInfiniteScrollProps({
    rowLength: 0,
    next: async () => {},
    hasMore: {},
  });
  let componentRef: ScrollingContainerRef | null = null;
  let wrapper: RenderHookResult<void, unknown> | null = null;

  const render =
    ({
      ref,
      props,
    }: {
      ref: ScrollingContainerRef;
      props: UseInfiniteScrollProps;
    }): (() => RenderHookResult<void, unknown>) =>
      () =>
        renderHook(() => {
          const { setRef } = useInfiniteScroll(props);
          return setRef(ref);
        });

  beforeEach(() => {
    infiniteScrollProps = createInfiniteScrollProps({
      rowLength: 0,
      next: async () => {},
      hasMore: {},
    });
    componentRef = createContainer({});
    wrapper = render({ ref: componentRef, props: infiniteScrollProps })();
  });

  it('should render without error', async () => {
    const { result } = wrapper!;

    expect(result.current).not.toBeNull();
  });
});
