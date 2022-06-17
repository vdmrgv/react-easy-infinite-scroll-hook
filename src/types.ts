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

export interface ReverseScrollDirection {
  vertical?: boolean;
  horizontal?: boolean;
}

export enum ScrollDirection {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

export type ScrollDirectionState = Partial<Record<ScrollDirection, boolean>>;

export interface HasMoreDataToLoadState {
  hasMore: ScrollDirectionState;
}

export interface IsLoadingNextState {
  isLoading: ScrollDirectionState;
}

export type ScrollParams = ScrollSize & ScrollPosition;

export type LoadNextFn = (direction: ScrollDirection) => Promise<void>;

export type EventListenerFn = (type: "scroll", callback: () => void) => void;

export type OnScrollFn = (value: Required<ScrollParams>) => void;

export type SetRefFn = (ref: any) => void;

export type ScrollContainer = Required<ScrollSize> & Required<ScrollPosition> & Required<ClientSize>;

export type ScrollingContainerRef = ScrollContainer & {
  addEventListener: EventListenerFn;
  removeEventListener: EventListenerFn;
};

export type InfiniteScrollState = DatasetLength &
  Required<ScrollSize> &
  Required<ClientSize> &
  IsLoadingNextState & {
    computedScrollThreshold: ComputedScrollThreshold;
  };

export type UseInfiniteScrollProps = DatasetLength &
  HasMoreDataToLoadState & {
    next: LoadNextFn;
    onScroll?: OnScrollFn;
    scrollThreshold?: number | string;
    initialScroll?: {
      top?: number;
      left?: number;
    };
    reverse?: ReverseScrollDirection;
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
