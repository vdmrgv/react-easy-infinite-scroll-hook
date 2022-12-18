import { ScrollAxisName, ScrollDirection } from '../types';
import { ScrollOffsetValues } from '../types/InfiniteScroll';
import { InfiniteScroll } from '../InfiniteScroll';
import { onLoadComplete } from './onLoadComplete';

export type LoadByDirectionArgs = {
  positiveDirection: ScrollDirection.UP | ScrollDirection.LEFT;
  negativeDirection: ScrollDirection.DOWN | ScrollDirection.RIGHT;
  offset: Required<ScrollOffsetValues>;
  loadMore: (ctx: InfiniteScroll) => void;
};

export const loadByDirection = async (
  ctx: InfiniteScroll,
  { positiveDirection, negativeDirection, offset, loadMore }: LoadByDirectionArgs
): Promise<void> => {
  const {
    state: { isLoading, thresholdReached },
    props: { next, hasMore },
  } = ctx;

  const axis = positiveDirection === ScrollDirection.UP ? ScrollAxisName.VERTICAL : ScrollAxisName.HORIZONTAL;

  // if the download has not started
  if (!isLoading) {
    const canLoadPositiveDirection =
      hasMore[positiveDirection] && !thresholdReached[positiveDirection] && offset![positiveDirection];
    const canLoadNegativeDirection =
      !canLoadPositiveDirection &&
      hasMore[negativeDirection] &&
      !thresholdReached[negativeDirection] &&
      offset![negativeDirection];

    if (canLoadPositiveDirection || canLoadNegativeDirection) {
      try {
        const loadDirection = canLoadPositiveDirection ? positiveDirection : negativeDirection;
        ctx.state.thresholdReached[loadDirection] = true;
        ctx.state.isLoading = true;
        await next(loadDirection);
      } finally {
        // make an axis check after the download is complete
        setTimeout(() => onLoadComplete(ctx, { axis, loadMore }), 100);
      }
    }
  }
};
