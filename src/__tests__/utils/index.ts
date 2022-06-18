import {
  ScrollingContainerRef,
  ScrollSize,
  ScrollPosition,
  ClientSize,
  EventListenerFn,
  UseInfiniteScrollProps,
  DatasetLength,
  ScrollDirectionState,
  ScrollDirection,
  ScrollParams,
  ScrollAxis,
} from '../../types';

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

type CreateInfiniteScrollProps = DatasetLength & {
  hasMore?: ScrollDirectionState;
  next?: (direction: ScrollDirection) => Promise<void>;
  onScroll?: (value: Required<ScrollParams>) => void;
  scrollThreshold?: number | string;
  initialScroll?: {
    top?: number;
    left?: number;
  };
  reverse?: ScrollAxis<boolean>;
};

export const createInfiniteScrollProps = ({
  hasMore = {
    up: false,
    down: false,
    left: false,
    right: false,
  },
  next = async () => {},
  onScroll,
  scrollThreshold,
  initialScroll,
  reverse,
}: CreateInfiniteScrollProps): UseInfiniteScrollProps => ({
  hasMore,
  next,
  onScroll,
  scrollThreshold,
  initialScroll,
  reverse,
});

export const settleUpdate = async (time = 1) => new Promise<void>((res) => setTimeout(() => res(), time));
