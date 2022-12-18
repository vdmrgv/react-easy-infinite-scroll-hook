import { ScrollDirection } from '../types';
import { InfiniteScroll } from '../InfiniteScroll';
import { getPossibleLoadDirections } from './getPossibleLoadDirections';

export type ResetReachedThresholdArgs = {
  direction: ScrollDirection;
  offset?: number;
  hardReset?: boolean;
};

export const resetReachedThreshold = (
  ctx: InfiniteScroll,
  { direction, offset, hardReset }: ResetReachedThresholdArgs
): void => {
  const possibleDirections = getPossibleLoadDirections(ctx, { offset });

  if ((!possibleDirections[direction] && ctx.state.thresholdReached[direction]) || hardReset)
    ctx.state.thresholdReached[direction] = false;
};
