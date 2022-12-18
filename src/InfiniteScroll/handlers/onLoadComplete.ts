import { ScrollAxisName, ScrollDirection } from '../types';
import { InfiniteScroll } from '../InfiniteScroll';
import { getMultiplierSign } from '../utils';
import { resetReachedThreshold } from './resetReachedThreshold';
import { scroll } from './scroll';

export type OnLoadCompleteArgs = {
  axis: ScrollAxisName;
  loadMore: (ctx: InfiniteScroll) => void;
};

export const onLoadComplete = (ctx: InfiniteScroll, { axis, loadMore }: OnLoadCompleteArgs) => {
  if (!ctx._scrollingContainerRef?.scrollingElement || !ctx.state.isLoading) return;

  const isVertical = axis === ScrollAxisName.VERTICAL;

  const {
    state: {
      rowCount: cachedRowCount = 0,
      columnCount: cachedColumnCount = 0,
      scrollHeight: cachedScrollHeight,
      scrollWidth: cachedScrollWidth,
    },
    props: { rowCount = 0, columnCount = 0, reverse = {} },
    _scrollingContainerRef,
  } = ctx;
  const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } =
    _scrollingContainerRef.scrollingElement!;

  // make a scroll check depending on the axis
  const cachedDataLength = isVertical ? cachedRowCount : cachedColumnCount;
  const newDataLength = isVertical ? rowCount : columnCount;
  const newDataReceived = cachedDataLength !== newDataLength;
  const scrollPosition = isVertical ? scrollTop : scrollLeft;
  const scrollSize = isVertical ? scrollHeight : scrollWidth;
  const cachedScrollSize = isVertical ? cachedScrollHeight : cachedScrollWidth;
  const clientSize = isVertical ? clientHeight : clientWidth;

  // if new data is loaded and the scroll position is less than the visible area, reset the scroll position
  // if the scroll position is at zero and new data is loaded to the beginning of the list, you need to shift the scroll position
  if (newDataReceived && Math.abs(scrollPosition) < clientSize) {
    const signMultiplier = getMultiplierSign(reverse[isVertical ? 'column' : 'row']);
    scroll(ctx, {
      [`scroll${isVertical ? 'Top' : 'Left'}`]: scrollPosition + (scrollSize - cachedScrollSize) * signMultiplier,
    });
  }

  Object.values(ScrollDirection).forEach((direction) => resetReachedThreshold(ctx, { direction }));

  ctx.state[isVertical ? 'scrollHeight' : 'scrollWidth'] = scrollSize;
  ctx.state[isVertical ? 'rowCount' : 'columnCount'] = newDataLength;
  ctx.state.isLoading = false;

  // wait a tick to try useEffect
  setTimeout(() => loadMore(ctx), 100);
};
