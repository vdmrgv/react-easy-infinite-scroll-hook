import { ElementRef, ScrollingContainerRef } from '../types';

export type GetScrollingContainerRefArgs = {
  ref: ElementRef | null;
  windowScroll?: boolean;
};

export const getScrollingContainerRef = ({
  ref,
  windowScroll,
}: GetScrollingContainerRefArgs): ScrollingContainerRef => {
  const scrollingContainerRef: ScrollingContainerRef = {
    scrollingElement: null,
    registerEventListener: null,
  };

  if (!windowScroll && ref) {
    let current: HTMLElement | null = null;

    // check if this ref contains a react-virtualized _scrollingContainer or use the incoming argument
    if ('_scrollingContainer' in ref) {
      current = ref._scrollingContainer;
    }
    if ('Grid' in ref) {
      current = ref.Grid._scrollingContainer;
    }
    if ('scrollHeight' in ref) {
      current = ref;
    }

    scrollingContainerRef.scrollingElement = current;
    scrollingContainerRef.registerEventListener = current;
  } else if (windowScroll) {
    scrollingContainerRef.scrollingElement = document.scrollingElement;
    scrollingContainerRef.registerEventListener = document;
  }

  return scrollingContainerRef;
};
