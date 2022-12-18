import { InfiniteScroll } from '../InfiniteScroll';
import { getValidScrollValue } from '../utils';

export const computeThreshold = (ctx: InfiniteScroll): void => {
  const {
    state: { clientWidth: cachedClientWidth, clientHeight: cachedClientHeight },
    props: { scrollThreshold = 1 },
    _scrollingContainerRef,
  } = ctx;

  if (
    !_scrollingContainerRef?.scrollingElement ||
    (cachedClientWidth === _scrollingContainerRef.scrollingElement.clientWidth &&
      cachedClientHeight === _scrollingContainerRef.scrollingElement.clientHeight)
  )
    return;

  const { clientWidth, clientHeight, scrollHeight, scrollWidth } = _scrollingContainerRef.scrollingElement;

  let computedThreshold = {
    vertical: 0,
    horizontal: 0,
  };

  // if the threshold is set as a string, we calculate the value in pixels
  // otherwise, we calculate the percentage of the size of the container
  if (typeof scrollThreshold === 'string') {
    const thresholdValue = Math.abs(parseInt(scrollThreshold));

    computedThreshold = {
      vertical: getValidScrollValue({
        newValue: thresholdValue,
        scrollSize: scrollHeight,
        fallbackValue: clientHeight,
      }),
      horizontal: getValidScrollValue({
        newValue: thresholdValue,
        scrollSize: scrollWidth,
        fallbackValue: clientWidth,
      }),
    };
  } else {
    const thresholdValue = scrollThreshold > 1 ? 1 : scrollThreshold <= 0 ? 0.1 : scrollThreshold;

    computedThreshold = {
      vertical: thresholdValue * clientHeight,
      horizontal: thresholdValue * clientWidth,
    };
  }

  ctx.state.computedScrollThreshold = computedThreshold;
  ctx.state.clientWidth = clientWidth;
  ctx.state.clientHeight = clientHeight;
};
