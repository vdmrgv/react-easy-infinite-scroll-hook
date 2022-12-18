import { ScrollingContainerRef } from '../types';

export const isValidScrollingContainerRef = (ref: ScrollingContainerRef): boolean => {
  const { scrollingElement, registerEventListener } = ref;

  if (
    (scrollingElement &&
      registerEventListener &&
      !(
        typeof scrollingElement.scrollHeight === 'number' &&
        typeof scrollingElement.scrollWidth === 'number' &&
        typeof scrollingElement.scrollLeft === 'number' &&
        typeof scrollingElement.scrollTop === 'number' &&
        typeof scrollingElement.clientHeight === 'number' &&
        typeof scrollingElement.clientWidth === 'number' &&
        typeof registerEventListener.addEventListener === 'function' &&
        typeof registerEventListener.removeEventListener === 'function'
      )) ||
    !scrollingElement ||
    !registerEventListener
  ) {
    console.error('Sorry I can\'t use this container - try using a different DOM element.');
    return false;
  }

  return true;
};
