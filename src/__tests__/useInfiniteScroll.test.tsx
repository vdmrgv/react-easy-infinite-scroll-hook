import { renderHook } from '@testing-library/react';
import useInfiniteScroll from '../useInfiniteScroll';
import { createContainer, CreateContainerParams, CreateInfiniteScrollProps, createInfiniteScrollProps } from './utils';

const render = (containerParams: CreateContainerParams, hookProps: CreateInfiniteScrollProps) => {
  const container = createContainer(containerParams);
  const props = {
    ...createInfiniteScrollProps({}),
    ...hookProps,
  };

  const result = renderHook(() => {
    const { setRef } = useInfiniteScroll(props);
    setRef(container);

    return container;
  });

  return { container, props, ...result };
};

describe('useInfiniteScroll', () => {
  it('should render without error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    const wrapper = render({}, {});

    expect(wrapper.result.current).not.toBeNull();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  describe('scroll container to new position', () => {
    it('shouldn\'t update scroll position', () => {
      const { container } = render({}, {});
      expect(container.scrollTop).toEqual(0);
      expect(container.scrollLeft).toEqual(0);
    });

    it('should update vertical scroll position', () => {
      const { container } = render(
        {},
        {
          initialScroll: {
            top: 10,
          },
        }
      );

      expect(container.scrollTop).toEqual(10);
      expect(container.scrollLeft).toEqual(0);
    });

    it('should update horizontal scroll position', () => {
      const { container } = render(
        {},
        {
          initialScroll: {
            left: 10,
          },
        }
      );

      expect(container.scrollTop).toEqual(0);
      expect(container.scrollLeft).toEqual(10);
    });

    it('should update scroll position', () => {
      const { container } = render(
        {},
        {
          initialScroll: {
            top: 10,
            left: 10,
          },
        }
      );

      expect(container.scrollTop).toEqual(10);
      expect(container.scrollLeft).toEqual(10);
    });

    describe('check if the new position is larger than the scroll size', () => {
      it('should check for a positive value', () => {
        const { container } = render(
          {},
          {
            initialScroll: {
              top: 1000,
              left: 1000,
            },
          }
        );

        expect(container.scrollTop).not.toEqual(100000);
        expect(container.scrollLeft).not.toEqual(100000);

        expect(container.scrollTop).toEqual(container.scrollHeight);
        expect(container.scrollLeft).toEqual(container.scrollWidth);
      });

      it('should check for a negative value', () => {
        const { container } = render(
          {},
          {
            initialScroll: {
              top: -1000,
              left: -1000,
            },
          }
        );

        expect(container.scrollTop).not.toEqual(100000);
        expect(container.scrollLeft).not.toEqual(100000);

        expect(container.scrollTop).toEqual(-container.scrollHeight);
        expect(container.scrollLeft).toEqual(-container.scrollWidth);
      });
    });
  });
});
