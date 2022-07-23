export interface ClientSize {
  clientHeight?: number;
  clientWidth?: number;
}

export interface DatasetLength {
  rowCount?: number;
  columnCount?: number;
}

export interface ScrollSize {
  scrollHeight?: number;
  scrollWidth?: number;
}

export interface ScrollPosition {
  scrollLeft?: number;
  scrollTop?: number;
}

export enum ScrollAxisName {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export interface ScrollAxis<T> {
  [ScrollAxisName.VERTICAL]?: T;
  [ScrollAxisName.HORIZONTAL]?: T;
}

export enum ScrollDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export type ScrollDirectionState = Partial<Record<ScrollDirection, boolean>>;

export type ScrollParams = ScrollSize & ScrollPosition & ClientSize;

export type EventListenerFn = (type: 'scroll', callback: () => void) => void;

export type SetRefFn = (ref: any) => void;

export type ScrollingElementRef = Required<ScrollSize> & Required<ScrollPosition> & Required<ClientSize>;

export type RegisterEventListener = {
  addEventListener: EventListenerFn;
  removeEventListener: EventListenerFn;
};

export interface ScrollingContainerRef {
  scrollingElement: ScrollingElementRef | null;
  registerEventListener: RegisterEventListener | null;
}

export type InfiniteScrollState = DatasetLength &
  Required<ScrollSize> &
  Required<ClientSize> & {
    isLoading: boolean;
    thresholdReached: ScrollDirectionState;
    computedScrollThreshold: Required<ScrollAxis<number>>;
    cleanup: (() => void)[];
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
    column?: boolean;
    row?: boolean;
  };
  windowScroll?: boolean;
};

export interface UseInfiniteScrollResult {
  setRef: SetRefFn;
}

export type InfiniteScrollProps = UseInfiniteScrollProps;

export type ScrollOffsetValues = Required<ScrollDirectionState>;

export interface InfiniteScroll {
  props: InfiniteScrollProps;
  state: InfiniteScrollState;
  _scrollingContainerRef?: ScrollingContainerRef;
  setRef: SetRefFn;
  clearListeners: () => void;
  update: (props: InfiniteScrollProps) => void;
}
