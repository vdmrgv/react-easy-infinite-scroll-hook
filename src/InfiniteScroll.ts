import {
    InfiniteScrollState,
    ComputedScrollThreshold,
    ScrollDirection,
    ScrollingContainerRef,
    ScrollOffsetValues,
    InfiniteScrollProps,
    UseInfiniteScrollProps,
    ScrollPosition,
} from "./types";

class InfiniteScroll {
    props: InfiniteScrollProps;

    state: InfiniteScrollState;

    onCleanup?: () => void;

    _scrollingContainerRef?: ScrollingContainerRef;

    constructor(props: InfiniteScrollProps) {
        this.props = props;
        this.state = {
            rowLength: props.rowLength,
            columnLength: props.columnLength,
            scrollHeight: 0,
            scrollWidth: 0,
            clientHeight: 0,
            clientWidth: 0,
            isLoading: {},
            computedScrollThreshold: {
                vertical: 0,
                horizontal: 0,
            },
        };
    }

    _hasContainer = function (this: InfiniteScroll): boolean {
        const hasContainer = !!this._scrollingContainerRef;

        if (!hasContainer) console.error("Somethig hepens with container! Reload the page!");

        return hasContainer;
    };

    _scroll = function (this: InfiniteScroll, { scrollTop, scrollLeft }: ScrollPosition): void {
        if (!this._scrollingContainerRef) return;
        const { scrollHeight, scrollWidth } = this._scrollingContainerRef;
        if (scrollTop !== undefined)
            this._scrollingContainerRef.scrollTop = Math.abs(scrollTop) > scrollHeight ? scrollHeight : scrollTop;
        if (scrollLeft !== undefined)
            this._scrollingContainerRef.scrollLeft = Math.abs(scrollLeft) > scrollWidth ? scrollWidth : scrollLeft;
    };

    _recomputeThreshold = function (this: InfiniteScroll): void {
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

        let computedThreshold: ComputedScrollThreshold = {
            vertical: 0,
            horizontal: 0,
        };

        if (typeof scrollThreshold === "string") {
            const thresholdValue = Math.abs(parseInt(scrollThreshold));

            computedThreshold = {
                vertical: thresholdValue > scrollHeight ? clientHeight : thresholdValue,
                horizontal: thresholdValue > scrollWidth ? clientWidth : thresholdValue,
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

    _getOffset = function (this: InfiniteScroll): Required<ScrollOffsetValues> {
        this._recomputeThreshold();

        const {
            state: { clientHeight, clientWidth, computedScrollThreshold },
            props: { reverse },
            _scrollingContainerRef,
        } = this;

        const { scrollHeight, scrollWidth, scrollLeft, scrollTop } = _scrollingContainerRef!;

        return {
            [reverse?.vertical ? ScrollDirection.DOWN : ScrollDirection.UP]:
        Math.abs(scrollTop) <= computedScrollThreshold.vertical,
            [reverse?.vertical ? ScrollDirection.UP : ScrollDirection.DOWN]:
        Math.abs(scrollTop) >= Math.abs(scrollHeight - clientHeight - computedScrollThreshold.vertical),
            [reverse?.horizontal ? ScrollDirection.RIGHT : ScrollDirection.LEFT]:
        Math.abs(scrollLeft) <= computedScrollThreshold.horizontal,
            [reverse?.horizontal ? ScrollDirection.LEFT : ScrollDirection.RIGHT]:
        Math.abs(scrollLeft) >= Math.abs(scrollWidth - clientWidth - computedScrollThreshold.horizontal),
        } as { [k in ScrollDirection]: boolean };
    };

    _checkScrollOffsetAndLoadMore = function (this: InfiniteScroll): void {
        const {
            state: { isLoading },
            props: { next, hasMore },
            _scrollingContainerRef,
        } = this;

        if (!_scrollingContainerRef) return;

        const offset = this._getOffset();

        const loadMore = (d1: ScrollDirection, d2: ScrollDirection) => {
            if (!(isLoading[d1] || isLoading[d2])) {
                const init1 = hasMore[d1] && offset![d1];
                const init2 = !init1 && hasMore[d2] && offset![d2];

                if (init1 || init2) {
                    const final = init1 ? d1 : d2;
                    this.state.isLoading = { ...this.state.isLoading, [final]: true };
                    next(final);
                }
            }
        };

        loadMore(ScrollDirection.UP, ScrollDirection.DOWN);
        loadMore(ScrollDirection.LEFT, ScrollDirection.RIGHT);
    };

    _setRef = function (this: InfiniteScroll, ref: any): void {
    // check does this ref contains react-virtualized _scrollingContainer or return element
        const current = ref.Grid?._scrollingContainer ?? ref;

        if (
            current &&
      !(
          typeof current.scrollHeight === "number" ||
        typeof current.scrollWidth === "number" ||
        typeof current.scrollLeft === "number" ||
        typeof current.scrollTop === "number" ||
        typeof current.clientHeight === "number" ||
        typeof current.clientWidth === "number" ||
        typeof current.addEventListener === "function" ||
        typeof current.removeEventListener === "function"
      )
        ) {
            console.error("Sorry I can`t use this container - try to use another DOM element.");
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

            this._checkScrollOffsetAndLoadMore();
        };

        this.state.scrollHeight = this._scrollingContainerRef.scrollHeight;
        this.state.scrollWidth = this._scrollingContainerRef.scrollWidth;

        const { initialScroll } = this.props;

        if (initialScroll)
            this._scroll({
                scrollTop: initialScroll.top,
                scrollLeft: initialScroll.left,
            });

        this._scrollingContainerRef.addEventListener("scroll", onScrollListener);
        this.onCleanup = () => this._scrollingContainerRef?.removeEventListener("scroll", onScrollListener);

        this._checkScrollOffsetAndLoadMore();
    };

    _onPropsChange = function (this: InfiniteScroll, props: UseInfiniteScrollProps) {
        this.props = props;

        const {
            state: { rowLength: cachedRowLength = 0, columnLength: cachedColumnLength = 0 },
            props: { rowLength = 0, columnLength = 0, reverse },
            _scrollingContainerRef,
        } = this;

        if (!_scrollingContainerRef) return;

        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = _scrollingContainerRef;

        if (cachedRowLength < rowLength) {
            if (Math.abs(scrollTop) < clientHeight) {
                const signMultiplier = reverse?.vertical ? -1 : 1;
                this._scroll({
                    scrollTop: scrollTop + (scrollHeight - this.state.scrollHeight) * signMultiplier,
                });
            }
            this.state.scrollHeight = scrollHeight;
            this.state.rowLength = rowLength;
            this.state.isLoading = {
                ...this.state.isLoading,
                up: false,
                down: false,
            };
        }

        if (cachedColumnLength < columnLength) {
            if (Math.abs(scrollLeft) < clientWidth) {
                const signMultiplier = reverse?.horizontal ? -1 : 1;
                this._scroll({
                    scrollLeft: scrollLeft + (scrollWidth - this.state.scrollWidth) * signMultiplier,
                });
            }
            this.state.scrollWidth = scrollWidth;
            this.state.columnLength = columnLength;
            this.state.isLoading = {
                ...this.state.isLoading,
                left: false,
                right: false,
            };
        }

        this._checkScrollOffsetAndLoadMore();
    };

    setRef = this._setRef.bind(this);

    onPropsChange = this._onPropsChange.bind(this);
}

export default InfiniteScroll;
