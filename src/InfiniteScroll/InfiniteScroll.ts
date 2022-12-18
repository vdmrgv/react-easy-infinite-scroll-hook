import { checkOffsetAndLoadMore, scroll } from './handlers';
import { ElementRef, InfiniteScrollProps, InfiniteScrollState, ScrollingContainerRef } from './types/InfiniteScroll';
import { getScrollingContainerRef, isValidScrollingContainerRef } from './utils';

export class InfiniteScroll {
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

  _setRef = function (this: InfiniteScroll, ref: ElementRef | null): void {
    const { windowScroll } = this.props;
    const scrollingContainerRef = getScrollingContainerRef({ ref, windowScroll });

    if (!isValidScrollingContainerRef(scrollingContainerRef)) {
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

      if (!this.state.isLoading) checkOffsetAndLoadMore(this);
    };

    this.state.rowCount = this.props.rowCount;
    this.state.columnCount = this.props.columnCount;
    this.state.scrollHeight = this._scrollingContainerRef.scrollingElement!.scrollHeight;
    this.state.scrollWidth = this._scrollingContainerRef.scrollingElement!.scrollWidth;

    const { initialScroll } = this.props;

    if (initialScroll)
      scroll(this, {
        scrollTop: initialScroll.top,
        scrollLeft: initialScroll.left,
      });

    this._onCleanup();
    this._scrollingContainerRef.registerEventListener!.addEventListener('scroll', onScrollListener);
    this._scrollingContainerRef.registerEventListener!.addEventListener('mouseup', onScrollListener);

    this.state.cleanup.push(() => {
      this._scrollingContainerRef?.registerEventListener?.removeEventListener('scroll', onScrollListener);
      this._scrollingContainerRef?.registerEventListener?.removeEventListener('mouseup', onScrollListener);
    });

    // initial loading
    checkOffsetAndLoadMore(this);
  };

  _onPropsChange = function (this: InfiniteScroll, props: InfiniteScrollProps) {
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
      checkOffsetAndLoadMore(this);
    }
  };

  _onCleanup = function (this: InfiniteScroll) {
    const {
      state: { cleanup },
    } = this;

    if (!cleanup.length) return;

    cleanup.forEach((f) => f());

    this.state.cleanup = [];
  };

  setRef = this._setRef.bind(this);
  onPropsChange = this._onPropsChange.bind(this);
  onCleanup = this._onCleanup.bind(this);
}
