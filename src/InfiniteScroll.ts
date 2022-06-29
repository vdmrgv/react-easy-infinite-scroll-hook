import {
  InfiniteScrollState,
  ScrollAxis,
  ScrollDirection,
  ScrollingContainerRef,
  ScrollOffsetValues,
  InfiniteScrollProps,
  UseInfiniteScrollProps,
  ScrollPosition,
} from './types';

class InfiniteScroll {
  props: InfiniteScrollProps;
  state: InfiniteScrollState;
  onCleanup?: () => void;

  _scrollingContainerRef?: ScrollingContainerRef;

  constructor(props: InfiniteScrollProps) {
    this.props = props;
    this.state = {
      rowCount: props.rowCount,
      columnCount: props.columnCount,
      scrollHeight: 0,
      scrollWidth: 0,
      clientHeight: 0,
      clientWidth: 0,
      isLoading: {
        start: {
          vertical: false,
          horizontal: false,
        },
        end: {
          vertical: false,
          horizontal: false,
        },
      },
      computedScrollThreshold: {
        vertical: 0,
        horizontal: 0,
      },
    };
  }

  _validateScrollValue = (scrollPosition: number, scrollSize: number, fallbackValue?: number): number => {
    const sign = scrollPosition < 0 ? -1 : 1;
    return Math.abs(scrollPosition) > scrollSize ? fallbackValue ?? scrollSize * sign : scrollPosition;
  };

  _scroll = function (this: InfiniteScroll, { scrollTop, scrollLeft }: ScrollPosition): void {
    if (!this._scrollingContainerRef) return;
    const { scrollHeight, scrollWidth } = this._scrollingContainerRef;

    if (scrollTop !== undefined)
      this._scrollingContainerRef.scrollTop = this._validateScrollValue(scrollTop, scrollHeight);
    if (scrollLeft !== undefined)
      this._scrollingContainerRef.scrollLeft = this._validateScrollValue(scrollLeft, scrollWidth);
  };

  _computeThreshold = function (this: InfiniteScroll): void {
    const {
      state: { clientWidth: cachedClientWidth, clientHeight: cachedClientHeight },
      props: { scrollThreshold = 1 },
      _scrollingContainerRef,
    } = this;

    if (
      !_scrollingContainerRef ||
      (cachedClientWidth === _scrollingContainerRef.clientWidth &&
        cachedClientHeight === _scrollingContainerRef.clientHeight)
    )
      return;

    const { clientWidth, clientHeight, scrollHeight, scrollWidth } = _scrollingContainerRef;

    let computedThreshold: Required<ScrollAxis<number>> = {
      vertical: 0,
      horizontal: 0,
    };

    // if the threshold is set as a string, we calculate the value in pixels
    // otherwise, we calculate the percentage of the size of the container
    if (typeof scrollThreshold === 'string') {
      const thresholdValue = Math.abs(parseInt(scrollThreshold));

      computedThreshold = {
        vertical: this._validateScrollValue(thresholdValue, scrollHeight, clientHeight),
        horizontal: this._validateScrollValue(thresholdValue, scrollWidth, clientWidth),
      };
    } else {
      const thresholdValue = scrollThreshold > 1 ? 1 : scrollThreshold <= 0 ? 0.1 : scrollThreshold;

      computedThreshold = {
        vertical: thresholdValue * clientHeight,
        horizontal: thresholdValue * clientWidth,
      };
    }

    this.state.computedScrollThreshold = computedThreshold;
    this.state.clientWidth = clientWidth;
    this.state.clientHeight = clientHeight;
  };

  _getPossibleDirection = function (this: InfiniteScroll): Required<ScrollOffsetValues> {
    this._computeThreshold();

    const {
      state: {
        clientHeight,
        clientWidth,
        computedScrollThreshold: { vertical: vThreshold, horizontal: hThreshold },
      },
      props: { reverse = {} },
      _scrollingContainerRef,
    } = this;

    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } = _scrollingContainerRef!;
    const { column, row } = reverse;

    const canLoadForward = (scrollPosition: number, threshold: number): boolean =>
      Math.abs(scrollPosition) <= threshold;
    const canLoadBack = (scrollPosition: number, scrollSize: number, clientSize: number, threshold: number): boolean =>
      Math.abs(scrollPosition) >= Math.abs(scrollSize - clientSize - threshold);

    return {
      [column ? ScrollDirection.DOWN : ScrollDirection.UP]: canLoadForward(scrollTop, vThreshold),
      [column ? ScrollDirection.UP : ScrollDirection.DOWN]: canLoadBack(
        scrollTop,
        scrollHeight,
        clientHeight,
        vThreshold
      ),
      [row ? ScrollDirection.RIGHT : ScrollDirection.LEFT]: canLoadForward(scrollLeft, hThreshold),
      [row ? ScrollDirection.LEFT : ScrollDirection.RIGHT]: canLoadBack(
        scrollLeft,
        scrollWidth,
        clientWidth,
        hThreshold
      ),
    } as { [k in ScrollDirection]: boolean };
  };

  _checkOffsetAndLoadMore = function (this: InfiniteScroll): void {
    const {
      state: {
        isLoading: { start },
      },
      props: { next, hasMore },
      _scrollingContainerRef,
    } = this;

    if (!_scrollingContainerRef) return;

    const offset = this._getPossibleDirection();

    const loadMore = async (direction1: ScrollDirection, direction2: ScrollDirection) => {
      const axis = direction1 === ScrollDirection.UP ? 'vertical' : 'horizontal';

      if (!(start[axis] || start[axis])) {
        const canLoad1 = hasMore[direction1] && offset![direction1];
        const canLoad2 = !canLoad1 && hasMore[direction2] && offset![direction2];

        if (canLoad1 || canLoad2) {
          try {
            const loadDirection = canLoad1 ? direction1 : direction2;
            this.state.isLoading.start[axis] = true;
            await next(loadDirection);
          } finally {
            this.state.isLoading.end[axis] = true;
          }
        }
      }
    };

    loadMore(ScrollDirection.UP, ScrollDirection.DOWN);
    loadMore(ScrollDirection.LEFT, ScrollDirection.RIGHT);
  };

  _setRef = function (this: InfiniteScroll, ref: any): void {
    // check if this ref contains a react-virtualized _scrollingContainer or use the incoming argument
    const current = ref?._scrollingContainer ?? ref?.Grid?._scrollingContainer ?? ref;

    if (
      (current &&
        !(
          typeof current.scrollHeight === 'number' ||
          typeof current.scrollWidth === 'number' ||
          typeof current.scrollLeft === 'number' ||
          typeof current.scrollTop === 'number' ||
          typeof current.clientHeight === 'number' ||
          typeof current.clientWidth === 'number' ||
          typeof current.addEventListener === 'function' ||
          typeof current.removeEventListener === 'function'
        )) ||
      !current
    ) {
      console.error('Sorry I can\'t use this container - try using a different DOM element.');
      return;
    }

    this._scrollingContainerRef = current as ScrollingContainerRef;

    const onScrollListener = () => {
      if (!this._scrollingContainerRef) return;

      const {
        _scrollingContainerRef: { scrollHeight, scrollWidth, scrollLeft, scrollTop },
        props: { onScroll },
      } = this;

      if (onScroll)
        onScroll({
          scrollHeight,
          scrollWidth,
          scrollLeft,
          scrollTop,
        });

      this._checkOffsetAndLoadMore();
    };

    this.state.scrollHeight = this._scrollingContainerRef.scrollHeight;
    this.state.scrollWidth = this._scrollingContainerRef.scrollWidth;

    const { initialScroll } = this.props;

    if (initialScroll)
      this._scroll({
        scrollTop: initialScroll.top,
        scrollLeft: initialScroll.left,
      });

    this._scrollingContainerRef.addEventListener('scroll', onScrollListener);
    this.onCleanup = () => this._scrollingContainerRef?.removeEventListener('scroll', onScrollListener);

    this._checkOffsetAndLoadMore();
  };

  _onPropsChange = function (this: InfiniteScroll, props: UseInfiniteScrollProps) {
    this.props = props;

    const {
      state: {
        rowCount: cachedRowLength = 0,
        columnCount: cachedColumnLength = 0,
        isLoading: { start, end },
      },
      props: { rowCount, columnCount, reverse = {}, hasMore },
      _scrollingContainerRef,
    } = this;

    if (!_scrollingContainerRef) return;

    if (rowCount === undefined && (hasMore.down || hasMore.up))
      console.warn(
        `You provided props with "hasMore: { up: ${!!hasMore.up}, down: ${!!hasMore.down} }" but "rowCount" is "undefined"`
      );

    if (columnCount === undefined && (hasMore.left || hasMore.right))
      console.warn(
        `You provided props with "hasMore: { left: ${!!hasMore.left}, right: ${!!hasMore.right} }" but "columnCount" is "undefined"`
      );

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = _scrollingContainerRef;
    const { column, row } = reverse;

    // if the scroll position is at zero and new data is loaded to the beginning of the list, you need to shift the scroll position
    const scrollToNewDataStart = (
      scrollPosition: number,
      clientSize: number,
      cachedDataLength: number,
      newDataLength: number,
      cachedScrollSize: number,
      newScrollSize: number,
      onScroll: (newPosition: number) => void,
      onLoadComplete: () => void,
      isLoading: {
        start: boolean;
        end: boolean;
      },
      reverse?: boolean
    ) => {
      const loadComplete = isLoading.start && isLoading.end;
      const newDataReceived = cachedDataLength !== newDataLength && loadComplete;

      // if new data is loaded and the scroll position is less than the visible area, reset the scroll position
      if (newDataReceived && Math.abs(scrollPosition) < clientSize) {
        const signMultiplier = reverse ? -1 : 1;
        onScroll(scrollPosition + (newScrollSize - cachedScrollSize) * signMultiplier);
      }

      // if the download is over
      if (loadComplete) {
        onLoadComplete();
      }
    };

    scrollToNewDataStart(
      scrollTop,
      clientHeight,
      cachedRowLength,
      rowCount ?? 0,
      this.state.scrollHeight,
      scrollHeight,
      (pos: number) => {
        this._scroll({
          scrollTop: pos,
        });
      },
      () => {
        this.state.isLoading = {
          start: {
            ...this.state.isLoading.start,
            vertical: false,
          },
          end: {
            ...this.state.isLoading.end,
            vertical: false,
          },
        };
      },
      {
        start: start.vertical,
        end: end.vertical,
      },
      column
    );

    scrollToNewDataStart(
      scrollLeft,
      clientWidth,
      cachedColumnLength,
      columnCount ?? 0,
      this.state.scrollWidth,
      scrollWidth,
      (pos: number) => {
        this._scroll({
          scrollLeft: pos,
        });
      },
      () => {
        this.state.isLoading = {
          start: {
            ...this.state.isLoading.start,
            horizontal: false,
          },
          end: {
            ...this.state.isLoading.end,
            horizontal: false,
          },
        };
      },
      {
        start: start.horizontal,
        end: end.horizontal,
      },
      row
    );

    this.state.scrollHeight = scrollHeight;
    this.state.rowCount = rowCount;
    this.state.scrollWidth = scrollWidth;
    this.state.columnCount = columnCount;

    this._checkOffsetAndLoadMore();
  };

  setRef = this._setRef.bind(this);
  onPropsChange = this._onPropsChange.bind(this);
}

export default InfiniteScroll;
