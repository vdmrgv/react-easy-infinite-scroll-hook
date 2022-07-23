import {
  InfiniteScrollState,
  ScrollAxis,
  ScrollDirection,
  ScrollingContainerRef,
  ScrollOffsetValues,
  InfiniteScrollProps,
  UseInfiniteScrollProps,
  ScrollPosition,
  ScrollAxisName,
} from './types';

class InfiniteScroll {
  props: InfiniteScrollProps;
  state: InfiniteScrollState;

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
      isLoading: false,
      computedScrollThreshold: {
        vertical: 0,
        horizontal: 0,
      },
      thresholdReached: {},
      cleanup: [],
    };
  }

  _validateScrollValue = (scrollPosition: number, scrollSize: number, fallbackValue?: number): number => {
    const sign = scrollPosition < 0 ? -1 : 1;
    return Math.abs(scrollPosition) > scrollSize ? fallbackValue ?? scrollSize * sign : scrollPosition;
  };

  _scroll = function (this: InfiniteScroll, { scrollTop, scrollLeft }: ScrollPosition): void {
    if (!this._scrollingContainerRef?.scrollingElement) return;
    const { scrollHeight, scrollWidth } = this._scrollingContainerRef.scrollingElement;

    if (scrollTop !== undefined)
      this._scrollingContainerRef.scrollingElement.scrollTop = this._validateScrollValue(scrollTop, scrollHeight);
    if (scrollLeft !== undefined)
      this._scrollingContainerRef.scrollingElement.scrollLeft = this._validateScrollValue(scrollLeft, scrollWidth);
  };

  _computeThreshold = function (this: InfiniteScroll): void {
    const {
      state: { clientWidth: cachedClientWidth, clientHeight: cachedClientHeight },
      props: { scrollThreshold = 1 },
      _scrollingContainerRef,
    } = this;

    if (
      !_scrollingContainerRef?.scrollingElement ||
      (cachedClientWidth === _scrollingContainerRef.scrollingElement.clientWidth &&
        cachedClientHeight === _scrollingContainerRef.scrollingElement.clientHeight)
    )
      return;

    const { clientWidth, clientHeight, scrollHeight, scrollWidth } = _scrollingContainerRef.scrollingElement;

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

  _getPossibleDirections = function (this: InfiniteScroll): Required<ScrollOffsetValues> {
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

    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } = _scrollingContainerRef!.scrollingElement!;
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

  _loadByDirection = async function (
    this: InfiniteScroll,
    direction1: ScrollDirection.UP | ScrollDirection.LEFT,
    direction2: ScrollDirection.DOWN | ScrollDirection.RIGHT,
    offset: Required<ScrollOffsetValues>
  ): Promise<void> {
    const {
      state: { isLoading, thresholdReached },
      props: { next, hasMore },
    } = this;

    const axis = direction1 === ScrollDirection.UP ? ScrollAxisName.VERTICAL : ScrollAxisName.HORIZONTAL;

    // if the download has not started
    if (!isLoading) {
      const canLoad1 = hasMore[direction1] && !thresholdReached[direction1] && offset![direction1];
      const canLoad2 = !canLoad1 && hasMore[direction2] && !thresholdReached[direction2] && offset![direction2];

      if (canLoad1 || canLoad2) {
        try {
          const loadDirection = canLoad1 ? direction1 : direction2;
          this.state.thresholdReached[loadDirection] = true;
          this.state.isLoading = true;
          await next(loadDirection);
        } finally {
          // make an axis check after the download is complete
          setTimeout(() => this._onLoadComplete(axis), 0);
        }
      }
    }
  };

  _checkOffsetAndLoadMore = function (this: InfiniteScroll): void {
    const { _scrollingContainerRef } = this;

    if (!_scrollingContainerRef) return;

    const offset = this._getPossibleDirections();

    const resetThreshold = (d: ScrollDirection) => {
      if (!offset[d] && this.state.thresholdReached[d]) this.state.thresholdReached[d] = false;
    };

    Object.values(ScrollDirection).forEach((d) => resetThreshold(d));

    this._loadByDirection(ScrollDirection.UP, ScrollDirection.DOWN, offset);
    this._loadByDirection(ScrollDirection.LEFT, ScrollDirection.RIGHT, offset);
  };

  _setRef = function (this: InfiniteScroll, ref: any): void {
    const scrollingContainerRef: ScrollingContainerRef = {
      scrollingElement: null,
      registerEventListener: null,
    };

    if (!this.props.windowScroll) {
      // check if this ref contains a react-virtualized _scrollingContainer or use the incoming argument
      const current = ref?._scrollingContainer ?? ref?.Grid?._scrollingContainer ?? ref;
      scrollingContainerRef.scrollingElement = current;
      scrollingContainerRef.registerEventListener = current;
    } else {
      scrollingContainerRef.scrollingElement = document.scrollingElement;
      scrollingContainerRef.registerEventListener = document;
    }

    const { scrollingElement, registerEventListener } = scrollingContainerRef;

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
      return;
    }

    this._scrollingContainerRef = scrollingContainerRef;

    const onScrollListener = () => {
      if (!this._scrollingContainerRef?.scrollingElement) return;

      const {
        _scrollingContainerRef: { scrollingElement },
        props: { onScroll },
      } = this;

      const { scrollHeight, scrollWidth, scrollLeft, scrollTop, clientHeight, clientWidth } = scrollingElement;

      if (onScroll)
        onScroll({
          clientHeight,
          clientWidth,
          scrollHeight,
          scrollWidth,
          scrollLeft,
          scrollTop,
        });

      this._checkOffsetAndLoadMore();
    };

    this.state.rowCount = this.props.rowCount;
    this.state.columnCount = this.props.columnCount;
    this.state.scrollHeight = this._scrollingContainerRef.scrollingElement!.scrollHeight;
    this.state.scrollWidth = this._scrollingContainerRef.scrollingElement!.scrollWidth;

    const { initialScroll } = this.props;

    if (initialScroll)
      this._scroll({
        scrollTop: initialScroll.top,
        scrollLeft: initialScroll.left,
      });

    // do cleanup before adding new listeners
    this._onCleanup();

    this._scrollingContainerRef.registerEventListener!.addEventListener('scroll', onScrollListener);

    this.state.cleanup.push(() =>
      this._scrollingContainerRef?.registerEventListener?.removeEventListener('scroll', onScrollListener)
    );

    // initial loading
    this._checkOffsetAndLoadMore();
  };

  _onLoadComplete = function (this: InfiniteScroll, axis: ScrollAxisName) {
    if (!this._scrollingContainerRef?.scrollingElement) return;

    const isVertical = axis === ScrollAxisName.VERTICAL;

    const {
      state: {
        rowCount: cachedRowCount = 0,
        columnCount: cachedColumnCount = 0,
        scrollHeight: cachedScrollHeight,
        scrollWidth: cachedScrollWidth,
      },
      props: { rowCount = 0, columnCount = 0, reverse = {} },
      _scrollingContainerRef,
    } = this;
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } =
      _scrollingContainerRef.scrollingElement!;

    // make a scroll check depending on the axis
    const cachedDataLength = isVertical ? cachedRowCount : cachedColumnCount;
    const newDataLength = isVertical ? rowCount : columnCount;
    const newDataReceived = cachedDataLength !== newDataLength;
    const scrollPosition = isVertical ? scrollTop : scrollLeft;
    const scrollSize = isVertical ? scrollHeight : scrollWidth;
    const cachedScrollSize = isVertical ? cachedScrollHeight : cachedScrollWidth;
    const clientSize = isVertical ? clientHeight : clientWidth;

    // if new data is loaded and the scroll position is less than the visible area, reset the scroll position
    // if the scroll position is at zero and new data is loaded to the beginning of the list, you need to shift the scroll position
    if (newDataReceived && Math.abs(scrollPosition) < clientSize) {
      const signMultiplier = reverse[isVertical ? 'column' : 'row'] ? -1 : 1;
      this._scroll({
        [`scroll${isVertical ? 'Top' : 'Left'}`]: scrollPosition + (scrollSize - cachedScrollSize) * signMultiplier,
      });
    }

    // download is over
    this.state.isLoading = false;
    this.state[isVertical ? 'scrollHeight' : 'scrollWidth'] = scrollSize;
    this.state[isVertical ? 'rowCount' : 'columnCount'] = newDataLength;

    // wait a tick to try useEffect
    setTimeout(() => this._checkOffsetAndLoadMore(), 100);
  };

  _onPropsChange = function (this: InfiniteScroll, props: UseInfiniteScrollProps) {
    this.props = props;

    const {
      state: { isLoading },
      props: { rowCount, columnCount, hasMore },
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

    if (!isLoading) {
      this._checkOffsetAndLoadMore();
    }
  };

  _onCleanup = function (this: InfiniteScroll) {
    const {
      state: { cleanup },
      _scrollingContainerRef,
    } = this;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (_scrollingContainerRef?.scrollingElement && _scrollingContainerRef?.scrollingElement.nodeName !== 'HTML')
      return;

    cleanup.forEach((f) => f());

    this.state.cleanup = [];
  };

  setRef = this._setRef.bind(this);
  onPropsChange = this._onPropsChange.bind(this);
  onCleanup = this._onCleanup.bind(this);
}

export default InfiniteScroll;
