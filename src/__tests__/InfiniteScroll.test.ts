import InfiniteScroll from '../InfiniteScroll';
import { InfiniteScrollProps, ScrollDirection } from '../types';
import { createContainer, createInfiniteScrollProps, settleUpdate, MockScrollingContainerRef } from './utils';

describe('InfiniteScroll', () => {
  const mockInfiniteScrollProps = createInfiniteScrollProps({
    rowCount: 0,
    next: async () => {},
    hasMore: {},
  });

  let instance: InfiniteScroll = new InfiniteScroll(mockInfiniteScrollProps);
  let container: MockScrollingContainerRef | null = null;
  const update = async (time = 10) => {
    container!.scroll!();
    await settleUpdate(time);
  };

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => null);

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

        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(JSON.stringify(updatedSrollingContainerRef)).toEqual(JSON.stringify(container));
      });

      test('set react-virtualized component', () => {
        const { setRef, _scrollingContainerRef } = instance;
        const rectVirtualizedInstance = { Grid: { _scrollingContainer: createContainer({}) } };
        expect(_scrollingContainerRef).toEqual(undefined);

        setRef(rectVirtualizedInstance);

        const { _scrollingContainerRef: updatedSrollingContainerRef } = instance;

        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(JSON.stringify(updatedSrollingContainerRef)).toEqual(JSON.stringify(container));
      });
    });

    it('should update instance with error', () => {
      const { setRef } = instance;

      setRef(null);

      const { _scrollingContainerRef: updatedSrollingContainerRef } = instance;

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(JSON.stringify(updatedSrollingContainerRef)).not.toEqual(JSON.stringify(container));
    });

    it('should update instance without warning', () => {
      const props = {
        ...mockInfiniteScrollProps,
        rowCount: 0,
        columnCount: 0,
        hasMore: { up: true, down: true, left: true, right: true },
      };

      const { setRef, onPropsChange } = new InfiniteScroll(props);

      setRef(container);
      onPropsChange(props);

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should update instance with warning', () => {
      const props = {
        ...mockInfiniteScrollProps,
        rowCount: undefined,
        columnCount: undefined,
        hasMore: { up: true, left: true },
      };

      const { setRef, onPropsChange } = new InfiniteScroll(props);

      setRef(container);
      onPropsChange(props);

      expect(consoleWarnSpy).toBeCalledTimes(2);
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

          expect(container?.scrollTop).toEqual(-container!.scrollHeight);
          expect(container?.scrollLeft).toEqual(-container!.scrollWidth);
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
        expect(container?.scroll).toEqual(undefined);
      });

      it('should call "onScroll" callback', async () => {
        const instanceProps: InfiniteScrollProps = {
          ...mockInfiniteScrollProps,
          onScroll: () => {},
        };

        instance = new InfiniteScroll(instanceProps);

        const spyOnScroll = jest.spyOn(instanceProps, 'onScroll');

        container = createContainer({});

        instance.setRef(container);

        await update();

        expect(spyOnScroll).toHaveBeenCalled();
      });
    });
  });

  describe('"onPropsChange" has been called', () => {
    beforeEach(() => {
      instance.setRef(container);
    });

    describe('state updates', () => {
      it('should update "scrollHeight", "scrollWidth", "rowCount", "columnCount" on each call', async () => {
        const { props, state, onPropsChange } = instance;
        const { scrollHeight, scrollWidth } = container!;

        expect(scrollHeight).toEqual(state.scrollHeight);
        expect(scrollWidth).toEqual(state.scrollWidth);
        expect(props.rowCount).toEqual(state.rowCount);
        expect(props.columnCount).toEqual(state.columnCount);

        container!.scrollHeight = 55;
        container!.scrollWidth = 55;
        const newProps = {
          ...instance.props,
          rowCount: 1000,
          columnCount: 100,
          hasMore: { up: true, left: true },
        };

        onPropsChange(newProps);

        await update(200);

        const { scrollHeight: newScrollHeight, scrollWidth: newScrollWidth } = container!;

        expect(newScrollHeight).toEqual(state.scrollHeight);
        expect(newScrollWidth).toEqual(state.scrollWidth);
        expect(newProps.rowCount).toEqual(state.rowCount);
        expect(newProps.columnCount).toEqual(state.columnCount);
      });

      describe('calculate offset threshold', () => {
        it('should calculate the threshold in "%"', async () => {
          const { onPropsChange } = instance;

          const newHeight = 155;
          const newWidth = 60;

          container!.clientHeight = newHeight;
          container!.clientWidth = newWidth;

          onPropsChange({
            ...instance.props,
            scrollThreshold: 0.4,
          });

          await update();

          const {
            state: {
              computedScrollThreshold: { vertical, horizontal },
            },
          } = instance;

          expect(newHeight * 0.4 + newWidth * 0.4).toEqual(horizontal + vertical);
        });

        it('should calculate the threshold in "px"', async () => {
          const { onPropsChange } = instance;

          const newHeight = 155;
          const newWidth = 60;

          container!.clientHeight = newHeight;
          container!.clientWidth = newWidth;

          onPropsChange({
            ...instance.props,
            scrollThreshold: '20px',
          });

          await update();

          const {
            state: {
              computedScrollThreshold: { vertical, horizontal },
            },
          } = instance;

          expect(20 + 20).toEqual(horizontal + vertical);
        });

        it('should update the threshold if the size of the container has been changed', async () => {
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

          await update();

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
          state: { isLoading },
        } = instance;

        expect(isLoading).toEqual(false);

        onPropsChange({
          ...instance.props,
          next,
          hasMore: { up: true },
        });

        await update();

        const {
          state: { isLoading: upIsLoading },
        } = instance;

        expect(upIsLoading).toEqual(true);

        continueLoading();
        await update();

        const {
          state: { isLoading: finalIsLoading },
        } = instance;

        expect(finalIsLoading).toEqual(false);
      });

      describe('normal direction', () => {
        test(ScrollDirection.UP, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { up: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.LEFT, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { left: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.DOWN, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { down: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollTop = container!.scrollHeight;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.RIGHT, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { right: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollLeft = container!.scrollWidth;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });
      });

      describe('reverse direction', () => {
        test(ScrollDirection.DOWN, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { down: true },
            reverse: { column: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.RIGHT, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { right: true },
            reverse: { row: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.UP, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { up: true },
            reverse: { column: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollTop = -container!.scrollHeight;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });

        test(ScrollDirection.LEFT, async () => {
          const newProps: InfiniteScrollProps = {
            ...instance.props,
            hasMore: { left: true },
            reverse: { row: true },
          };

          const spyNext = jest.spyOn(newProps, 'next');

          container!.scrollLeft = -container!.scrollWidth;

          const { onPropsChange } = instance;

          onPropsChange(newProps);

          await update();

          expect(spyNext).toBeCalledTimes(1);
        });
      });

      describe('load only one direction on the same axis at a time', () => {
        test('"vertical" axis', async () => {
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

          await update();

          container!.scrollTop = container!.scrollHeight;

          onPropsChange(newProps);

          await update();

          continueLoading();

          expect(spyNext).toBeCalledTimes(1);
        });

        test('"horizontal" axis', async () => {
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

          await update();

          container!.scrollLeft = container!.scrollWidth;

          onPropsChange(newProps);

          await update();

          continueLoading();

          expect(spyNext).toBeCalledTimes(1);
        });
      });

      test(`load direction on the cross axis at a time (for example: ${ScrollDirection.DOWN} and ${ScrollDirection.LEFT})`, async () => {
        const newProps: InfiniteScrollProps = {
          ...instance.props,
          hasMore: { up: true, left: true },
        };

        const spyNext = jest.spyOn(newProps, 'next');

        const { onPropsChange } = instance;

        onPropsChange(newProps);

        await update(200);

        expect(spyNext).toBeCalledTimes(2);
      });

      it('shouldn\'t call "next" if hasMore is "false"', async () => {
        const newProps: InfiniteScrollProps = {
          ...instance.props,
        };

        const spyNext = jest.spyOn(newProps, 'next');

        const { onPropsChange } = instance;

        onPropsChange(newProps);

        await update();

        expect(spyNext).not.toBeCalled();
      });

      describe('scroll to the beginning of the list of new items if the scroll position is 0', () => {
        describe('vertical axis', () => {
          test('normal direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { up: true },
              rowCount: 20,
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            container!.scrollHeight = container!.scrollHeight * 2;

            await update();

            expect(container!.scrollTop).toEqual(container!.scrollHeight / 2);
          });

          test('reverse direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { down: true },
              reverse: { column: true },
              rowCount: 20,
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            container!.scrollHeight = container!.scrollHeight * 2;

            await update();

            expect(container!.scrollTop).toEqual(-container!.scrollHeight / 2);
          });
        });

        describe('horizontal axis', () => {
          test('normal direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { left: true },
              columnCount: 20,
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            container!.scrollWidth = container!.scrollWidth * 2;

            await update();

            expect(container!.scrollLeft).toEqual(container!.scrollWidth / 2);
          });

          test('reverse direction', async () => {
            const newProps: InfiniteScrollProps = {
              ...instance.props,
              hasMore: { right: true },
              reverse: { row: true },
              columnCount: 20,
            };

            const { onPropsChange } = instance;

            onPropsChange(newProps);

            container!.scrollWidth = container!.scrollWidth * 2;

            await update();

            expect(container!.scrollLeft).toEqual(-container!.scrollWidth / 2);
          });
        });
      });
    });
  });
});
