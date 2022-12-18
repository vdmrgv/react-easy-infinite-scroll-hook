import { ScrollDirection } from '../types';
import { InfiniteScroll } from '../InfiniteScroll';
import { getPossibleLoadDirections } from './getPossibleLoadDirections';
import { loadByDirection } from './loadByDirection';
import { resetReachedThreshold } from './resetReachedThreshold';

export const checkOffsetAndLoadMore = (ctx: InfiniteScroll): void => {
  const { _scrollingContainerRef } = ctx;

  if (!_scrollingContainerRef) return;
  if (!ctx.state.isLoading)
    Object.values(ScrollDirection).forEach((direction) =>
      resetReachedThreshold(ctx, { direction, offset: 0, hardReset: true })
    );

  const offset = getPossibleLoadDirections(ctx);

  // try to load vertical axis values
  loadByDirection(ctx, {
    positiveDirection: ScrollDirection.UP,
    negativeDirection: ScrollDirection.DOWN,
    offset,
    loadMore: checkOffsetAndLoadMore,
  });

  // try to load horizontal axis values
  loadByDirection(ctx, {
    positiveDirection: ScrollDirection.LEFT,
    negativeDirection: ScrollDirection.RIGHT,
    offset,
    loadMore: checkOffsetAndLoadMore,
  });
};
