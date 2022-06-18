import { ScrollingContainerRef, ScrollSize, ScrollPosition, ClientSize, EventListenerFn } from '../../types';

type CreateContainerParams = ScrollSize &
  ScrollPosition &
  ClientSize & {
    addEventListener?: EventListenerFn;
    removeEventListener?: EventListenerFn;
  };

export const createContainer = ({
  scrollHeight = 200,
  scrollWidth = 200,
  scrollTop = 0,
  scrollLeft = 0,
  clientHeight = 100,
  clientWidth = 100,
  addEventListener = () => {},
  removeEventListener = () => {},
}: CreateContainerParams): ScrollingContainerRef => ({
  scrollHeight,
  scrollWidth,
  scrollTop,
  scrollLeft,
  clientHeight,
  clientWidth,
  addEventListener,
  removeEventListener,
});

export const settleUpdate = async (time = 100) => new Promise<void>((res) => setTimeout(() => res(), time));
