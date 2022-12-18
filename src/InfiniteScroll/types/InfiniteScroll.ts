import { ClientSize, Dataset, EventListenerFn, ScrollParams, ScrollSize } from './common';
import { ScrollDirection } from './enums';
import { ScrollAxis, ScrollDirectionState } from './generics';

export type SetRefFn = <T = any>(ref: T) => void;

export type ScrollingElementRef = Required<ScrollParams>;

export type RegisterEventListener = {
  addEventListener: EventListenerFn;
  removeEventListener: EventListenerFn;
};

export type ScrollingContainerRef = {
  scrollingElement: ScrollingElementRef | null;
  registerEventListener: RegisterEventListener | null;
};

export type VirtualizedScrollingContainer = {
  _scrollingContainer: HTMLElement;
};

export type VirtualizedGrid = {
  Grid: VirtualizedScrollingContainer;
};

export type ElementRef = VirtualizedScrollingContainer | VirtualizedGrid | HTMLElement;

export type InfiniteScrollRef<T> = React.MutableRefObject<T | null>;

export type ScrollDirectionBooleanState = ScrollDirectionState<boolean>;

export type ScrollOffsetValues = Required<ScrollDirectionBooleanState>;

export type InfiniteScrollState = Dataset &
  Required<ScrollSize> &
  Required<ClientSize> & {
    isLoading: boolean;
    thresholdReached: ScrollDirectionBooleanState;
    computedScrollThreshold: Required<ScrollAxis<number>>;
    cleanup: (() => void)[];
  };

export type InfiniteScrollProps = Dataset & {
  hasMore: ScrollDirectionBooleanState;
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

export interface InfiniteScroll {
  props: InfiniteScrollProps;
  state: InfiniteScrollState;
  _scrollingContainerRef?: ScrollingContainerRef;
  setRef: SetRefFn;
  clearListeners: () => void;
  update: (props: InfiniteScrollProps) => void;
}
