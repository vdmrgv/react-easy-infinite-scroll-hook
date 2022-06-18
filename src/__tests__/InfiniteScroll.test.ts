import InfiniteScroll from '../InfiniteScroll';
import { InfiniteScrollProps, ScrollingContainerRef, ScrollDirection } from '../types';
import { createContainer, createInfiniteScrollProps, settleUpdate } from './utils';

describe('InfiniteScroll', () => {
  const mockInfiniteScrollProps = createInfiniteScrollProps({
    rowLength: 0,
    next: async () => {},
    hasMore: {},
  });

  let instance: InfiniteScroll = new InfiniteScroll(mockInfiniteScrollProps);
  let container: ScrollingContainerRef | null = null;

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => null);

  beforeEach(() => {
    instance = new InfiniteScroll(mockInfiniteScrollProps);
    container = createContainer({});
  });

  describe('initialize "_scrollingContainerRef" via "setRef', () => {
    afterEach(() => {
      console.clear();
    });

    describe('should update instance without error', () => {
      test('set any DOM element', async () => {
        const { setRef, _scrollingContainerRef } = instance;
        expect(_scrollingContainerRef).toEqual(undefined);

        setRef(container);

        const { _scrollingContainerRef: updatedSrollingContainerRef } = instance;

        expect(consoleSpy).not.toHaveBeenCalled();
        expect(JSON.stringify(updatedSrollingContainerRef)).toEqual(JSON.stringify(container));
      });

      test('set react-virtualized component', () => {
        const { setRef, _scrollingContainerRef } = instance;
        const rectVirtualizedInstance = { Grid: { _scrollingContainer: createContainer({}) } };
        expect(_scrollingContainerRef).toEqual(undefined);

        setRef(rectVirtualizedInstance);

        const { _scrollingContainerRef: updatedSrollingContainerRef } = instance;

        expect(consoleSpy).not.toHaveBeenCalled();
        expect(JSON.stringify(updatedSrollingContainerRef)).toEqual(JSON.stringify(container));
      });
    });

    it('should update instance with error', () => {
      const { setRef } = instance;

      setRef(null);

      const { _scrollingContainerRef: updatedSrollingContainerRef } = instance;

      expect(consoleSpy).toHaveBeenCalled();
      expect(JSON.stringify(updatedSrollingContainerRef)).not.toEqual(JSON.stringify(container));
    });

    describe('scroll container to new position', () => {
      it('shouldn\'t update scroll position', () => {
        const { setRef } = instance;
        expect(container?.scrollTop).toEqual(0);
        expect(container?.scrollLeft).toEqual(0);

        setRef(container);

        expect(container?.scrollTop).toEqual(0);
        expect(container?.scrollLeft).toEqual(0);
      });

      it('should update vertical scroll position', () => {
        const { setRef } = new InfiniteScroll({
          ...mockInfiniteScrollProps,
          initialScroll: {
            top: 10,
          },
        });

        expect(container?.scrollTop).toEqual(0);
        expect(container?.scrollLeft).toEqual(0);

        setRef(container);

        expect(container?.scrollTop).toEqual(10);
        expect(container?.scrollLeft).toEqual(0);
      });

      it('should update horizontal scroll position', () => {
        const { setRef } = new InfiniteScroll({
          ...mockInfiniteScrollProps,
          initialScroll: {
            left: 10,
          },
        });

        expect(container?.scrollTop).toEqual(0);
        expect(container?.scrollLeft).toEqual(0);

        setRef(container);

        expect(container?.scrollTop).toEqual(0);
        expect(container?.scrollLeft).toEqual(10);
      });

      it('should update scroll position', () => {
        const { setRef } = new InfiniteScroll({
          ...mockInfiniteScrollProps,
          initialScroll: {
            top: 10,
            left: 10,
          },
        });

        expect(container?.scrollTop).toEqual(0);
        expect(container?.scrollLeft).toEqual(0);

        setRef(container);

        expect(container?.scrollTop).toEqual(10);
        expect(container?.scrollLeft).toEqual(10);
      });

      describe('check if the new position is larger than the scroll size', () => {
        it('should check for a positive value', () => {
          const { setRef } = new InfiniteScroll({
            ...mockInfiniteScrollProps,
            initialScroll: {
              top: 1000,
              left: 1000,
            },
          });

          expect(container?.scrollTop).toEqual(0);
          expect(container?.scrollLeft).toEqual(0);

          setRef(container);

          expect(container?.scrollTop).not.toEqual(100000);
          expect(container?.scrollLeft).not.toEqual(100000);

          expect(container?.scrollTop).toEqual(container?.scrollHeight);
          expect(container?.scrollLeft).toEqual(container?.scrollWidth);
        });

        it('should check for a negative value', () => {
          const { setRef } = new InfiniteScroll({
            ...mockInfiniteScrollProps,
            initialScroll: {
              top: -1000,
              left: -1000,
            },
          });

          expect(container?.scrollTop).toEqual(0);
          expect(container?.scrollLeft).toEqual(0);

          setRef(container);

          expect(container?.scrollTop).not.toEqual(100000);
          expect(container?.scrollLeft).not.toEqual(100000);

          expect(container?.scrollTop).toEqual(container?.scrollHeight);
          expect(container?.scrollLeft).toEqual(container?.scrollWidth);
        });
      });
    });

    describe('register an event listener', () => {
      it('should add event listener', () => {
        const spyAddEventListener = jest.spyOn(container!, 'addEventListener');
        const { setRef } = instance;

        setRef(container);

        expect(spyAddEventListener).toHaveBeenCalled();
      });

      it('should add remove event listener', () => {
        const spyRemoveEventListener = jest.spyOn(container!, 'removeEventListener');
        const { setRef, onCleanup } = instance;

        expect(onCleanup).toEqual(undefined);

        setRef(container);

        const { onCleanup: onCleanupListener } = instance;

        expect(onCleanupListener).not.toEqual(undefined);

        onCleanupListener!();

        expect(spyRemoveEventListener).toHaveBeenCalled();
      });

      it('should call "onScroll" callback', () => {
        const instanceProps: InfiniteScrollProps = {
          ...mockInfiniteScrollProps,
          onScroll: () => {},
        };

        instance = new InfiniteScroll(instanceProps);

        const spyOnScroll = jest.spyOn(instanceProps, 'onScroll');

        const fakeScrollEvent: { [k: string]: () => void } = {};

        const addEventListener = (type: string, callback: () => void) => {
          fakeScrollEvent[type] = callback;
        };

        instance.setRef(
          createContainer({
            addEventListener,
          })
        );

        fakeScrollEvent['scroll']();

        expect(spyOnScroll).toHaveBeenCalled();
      });
    });
  });

  describe('"onPropsChange" has been called', () => {
    beforeEach(() => {
      instance.setRef(container);
    });

    describe('state updates', () => {
      it('should update "scrollHeight", "scrollWidth", "rowLength", "columnLength" on each call', () => {
        const { props, state, onPropsChange } = instance;
        const { scrollHeight, scrollWidth } = container!;

        expect(scrollHeight).toEqual(state.scrollHeight);
        expect(scrollWidth).toEqual(state.scrollWidth);
        expect(props.rowLength).toEqual(state.rowLength);
        expect(props.columnLength).toEqual(state.columnLength);

        container!.scrollHeight = 55;
        container!.scrollWidth = 55;
        const newProps = {
          ...instance.props,
          rowLength: 1000,
          columnLength: 100,
        };

        onPropsChange(newProps);

        const { scrollHeight: newScrollHeight, scrollWidth: newScrollWidth } = container!;

        expect(newScrollHeight).toEqual(state.scrollHeight);
        expect(newScrollWidth).toEqual(state.scrollWidth);
        expect(newProps.rowLength).toEqual(state.rowLength);
        expect(newProps.columnLength).toEqual(state.columnLength);
      });

      it('should update the threshold if the size of the container has been changed', () => {
        const {
          state: {
            clientHeight: instHeight,
            clientWidth: instWidth,
            computedScrollThreshold: { vertical, horizontal },
          },
          onPropsChange,
        } = instance;
        const { clientHeight, clientWidth } = container!;

        expect(clientHeight).toEqual(instHeight);
        expect(clientWidth).toEqual(instWidth);

        // default scroll threshold is 100% of client size
        // clientHeight = 200
        // clientWidth = 200
        expect(clientHeight + clientWidth).toEqual(horizontal + vertical);

        const newHeight = 155;
        const newWidth = 60;

        container!.clientHeight = newHeight;
        container!.clientWidth = newWidth;

        onPropsChange(instance.props);

        const {
          clientHeight: updatedHeight,
          clientWidth: updatedWidth,
          computedScrollThreshold: { vertical: vThreshold, horizontal: hThreshold },
        } = instance.state;

        expect(newHeight).toEqual(updatedHeight);
        expect(newWidth).toEqual(updatedWidth);
        expect(newHeight + newWidth).toEqual(vThreshold + hThreshold);
      });
    });

    describe('load more items', () => {
      test('update load state', async () => {
        let continueLoading = () => {};
        const next = () =>
          new Promise<void>((res) => {
            continueLoading = res;
          });

        const {
          onPropsChange,
          state: {
            isLoading: { start, end },
          },
        } = instance;

        expect(start).toEqual({ vertical: false, horizontal: false });
        expect(end).toEqual({ vertical: false, horizontal: false });

        onPropsChange({
          ...instance.props,
          next,
          hasMore: { up: true },
        });

        const {
          state: {
            isLoading: { start: upStart, end: upEnd },
          },
        } = instance;

        expect(upStart).toEqual({ vertical: true, horizontal: false });
        expect(upEnd).toEqual({ vertical: false, horizontal: false });

        continueLoading();
        await settleUpdate();

        const {
          state: {
            isLoading: { start: finalStart, end: finalEnd },
          },
        } = instance;

        expect(finalStart).toEqual({ vertical: true, horizontal: false });
        expect(finalEnd).toEqual({ vertical: true, horizontal: false });
      });

      describe('normal direction', () => {
        test(ScrollDirection.UP, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { up: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.LEFT, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { left: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.DOWN, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { down: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollTop = container!.scrollHeight;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.RIGHT, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { right: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollLeft = container!.scrollWidth;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });
      });

      describe('reverse direction', () => {
        test(ScrollDirection.DOWN, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { down: true },
            reverse: { vertical: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.RIGHT, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { right: true },
            reverse: { horizontal: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.UP, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { up: true },
            reverse: { vertical: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollTop = -container!.scrollHeight;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.LEFT, () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { left: true },
            reverse: { horizontal: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollLeft = -container!.scrollWidth;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          expect(spyNext).toBeCalledTimes(1);
        });
      });

      describe('load only one direction on the same axis at a time', () => {
        test('"vertical" axis', () => {
          let continueLoading = () => {};
          const next = () =>
            new Promise<void>((res) => {
              continueLoading = res;
            });

          const newProps: InfiniteScrollProps = {
            ...instance.props,
            next,
            hasMore: { up: true, down: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          container!.scrollTop = container!.scrollHeight;

          onPropsChange(newProps);

          continueLoading();

          expect(spyNext).toBeCalledTimes(1);
        });

        test('"horizontal" axis', () => {
          let continueLoading = () => {};
          const next = () =>
            new Promise<void>((res) => {
              continueLoading = res;
            });

          const newProps: InfiniteScrollProps = {
            ...instance.props,
            next,
            hasMore: { left: true, right: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          container!.scrollLeft = container!.scrollWidth;

          onPropsChange(newProps);

          continueLoading();

          expect(spyNext).toBeCalledTimes(1);
        });
      });

      test(`load direction on the cross axis at a time (for example: ${ScrollDirection.DOWN} and ${ScrollDirection.LEFT})`, () => {
        const newProps: InfiniteScrollProps = {
          ...instance.props,
          hasMore: { up: true, left: true },
        };

        const spyNext = jest.spyOn(newProps, 'next');

        const { onPropsChange } = instance;

        onPropsChange(newProps);

        expect(spyNext).toBeCalledTimes(2);
      });

      it('shouldn\'t call "next" if hasMore is "false"', () => {
        const newProps: InfiniteScrollProps = {
          ...instance.props,
        };

        const spyNext = jest.spyOn(newProps, 'next');

        const { onPropsChange } = instance;

        onPropsChange(newProps);

        expect(spyNext).not.toBeCalled();
      });

      describe('scroll to the beginning of the list of new items if the scroll position is 0', () => {
        describe('vertical axis', () => {
          test('normal direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { up: true },
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            await settleUpdate();

            container!.scrollHeight = container!.scrollHeight * 2;

            onPropsChange({
              ...newProps,
              rowLength: 20,
            });

            expect(container!.scrollTop).toEqual(container!.scrollHeight / 2);
          });

          test('reverse direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { down: true },
              reverse: { vertical: true },
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            await settleUpdate();

            container!.scrollHeight = container!.scrollHeight * 2;

            onPropsChange({
              ...newProps,
              rowLength: 20,
            });

            expect(container!.scrollTop).toEqual(-container!.scrollHeight / 2);
          });
        });

        describe('horizontal axis', () => {
          test('normal direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { left: true },
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            await settleUpdate();

            container!.scrollWidth = container!.scrollWidth * 2;

            onPropsChange({
              ...newProps,
              columnLength: 20,
            });

            expect(container!.scrollLeft).toEqual(container!.scrollWidth / 2);
          });

          test('reverse direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { right: true },
              reverse: { horizontal: true },
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            await settleUpdate();

            container!.scrollWidth = container!.scrollWidth * 2;

            onPropsChange({
              ...newProps,
              columnLength: 20,
            });

            expect(container!.scrollLeft).toEqual(-container!.scrollWidth / 2);
          });
        });
      });
    });
  });
});
