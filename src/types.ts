export interface ClientSize {
  clientHeight?: number;
  clientWidth?: number;
}

export interface DatasetLength {
  rowLength?: number;
  columnLength?: number;
}

export interface ScrollSize {
  scrollHeight?: number;
  scrollWidth?: number;
}

export interface ScrollPosition {
  scrollLeft?: number;
  scrollTop?: number;
}

export interface ComputedScrollThreshold {
  vertical: number;
  horizontal: number;
}

export enum ScrollDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export type ScrollDirectionState = Partial<Record<ScrollDirection, boolean>>;

export type ScrollParams = ScrollSize & ScrollPosition;

export type EventListenerFn = (type: 'scroll', callback: () => void) => void;

export type SetRefFn = (ref: any) => void;

export type ScrollingContainerRef = Required<ScrollSize> &
  Required<ScrollPosition> &
  Required<ClientSize> & {
    addEventListener: EventListenerFn;
    removeEventListener: EventListenerFn;
  };

export type InfiniteScrollState = DatasetLength &
  Required<ScrollSize> &
  Required<ClientSize> & {
    isLoading: ScrollDirectionState;
    computedScrollThreshold: ComputedScrollThreshold;
  };

export type UseInfiniteScrollProps = DatasetLength & {
  hasMore: ScrollDirectionState;
  next: (direction: ScrollDirection) => Promise<void>;
  onScroll?: (value: Required<ScrollParams>) => void;
  scrollThreshold?: number | string;
  initialScroll?: {
    top?: number;
    left?: number;
  };
  reverse?: {
    vertical?: boolean;
    horizontal?: boolean;
  };
};

export interface UseInfiniteScrollResult {
  setRef: SetRefFn;
}

export type InfiniteScrollProps = UseInfiniteScrollProps;

export type ScrollOffsetValues = Required<ScrollDirectionState> | null;

export interface InfiniteScroll {
  props: InfiniteScrollProps;
  state: InfiniteScrollState;
  _scrollingContainerRef?: ScrollingContainerRef;
  setRef: SetRefFn;
  clearListeners: () => void;
  update: (props: InfiniteScrollProps) => void;
}
