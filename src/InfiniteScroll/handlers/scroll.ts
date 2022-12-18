import { ScrollPosition } from '../types';
import { InfiniteScroll } from '../InfiniteScroll';
import { getValidScrollValue } from '../utils';

export const scroll = (ctx: InfiniteScroll, { scrollTop, scrollLeft }: ScrollPosition): void => {
  if (!ctx._scrollingContainerRef?.scrollingElement) return;

  const { scrollHeight, scrollWidth } = ctx._scrollingContainerRef.scrollingElement;

  if (scrollTop !== undefined)
    ctx._scrollingContainerRef.scrollingElement.scrollTop = getValidScrollValue({
      newValue: scrollTop,
      scrollSize: scrollHeight,
    });
  if (scrollLeft !== undefined)
    ctx._scrollingContainerRef.scrollingElement.scrollLeft = getValidScrollValue({
      newValue: scrollLeft,
      scrollSize: scrollWidth,
    });
};
