import { ScrollDirection } from '../types';
import { ScrollOffsetValues } from '../types/InfiniteScroll';
import { InfiniteScroll } from '../InfiniteScroll';
import { computeThreshold } from './computeThreshold';

export type GetPossibleLoadDirectionsArgs = {
  offset?: number;
};

const canLoadForward = (scrollPosition: number, threshold: number, offset: number): boolean =>
  Math.abs(scrollPosition) <= threshold - offset;
const canLoadBack = (
  scrollPosition: number,
  scrollSize: number,
  clientSize: number,
  threshold: number,
  offset: number
): boolean => Math.abs(scrollPosition) >= Math.abs(scrollSize - clientSize - threshold - offset);

export const getPossibleLoadDirections = (
  ctx: InfiniteScroll,
  args?: GetPossibleLoadDirectionsArgs
): Required<ScrollOffsetValues> => {
  // recalculate threshold
  computeThreshold(ctx);

  const offset = args?.offset ?? 0;
  const {
    state: {
      clientHeight,
      clientWidth,
      computedScrollThreshold: { vertical: vThreshold, horizontal: hThreshold },
    },
    props: { reverse = {} },
    _scrollingContainerRef,
  } = ctx;

  if (!_scrollingContainerRef?.scrollingElement)
    return Object.values(ScrollDirection).reduce(
      (acc, direction) => ({ ...acc, [direction]: false }),
      {} as { [k in ScrollDirection]: boolean }
    );

  const { scrollHeight, scrollWidth, scrollLeft, scrollTop } = _scrollingContainerRef.scrollingElement;
  const { column, row } = reverse;

  return {
    [column ? ScrollDirection.DOWN : ScrollDirection.UP]: canLoadForward(scrollTop, vThreshold, offset),
    [column ? ScrollDirection.UP : ScrollDirection.DOWN]: canLoadBack(
      scrollTop,
      scrollHeight,
      clientHeight,
      vThreshold,
      offset
    ),
    [row ? ScrollDirection.RIGHT : ScrollDirection.LEFT]: canLoadForward(scrollLeft, hThreshold, offset),
    [row ? ScrollDirection.LEFT : ScrollDirection.RIGHT]: canLoadBack(
      scrollLeft,
      scrollWidth,
      clientWidth,
      hThreshold,
      offset
    ),
  } as { [k in ScrollDirection]: boolean };
};
