export type ClientSize = {
  clientHeight?: number;
  clientWidth?: number;
};

export type ScrollSize = {
  scrollHeight?: number;
  scrollWidth?: number;
};

export type ScrollPosition = {
  scrollLeft?: number;
  scrollTop?: number;
};

export interface Dataset {
  rowCount?: number;
  columnCount?: number;
}

export type ScrollParams = ScrollSize & ScrollPosition & ClientSize;

export type EventListenerFn = (type: 'scroll', callback: () => void) => void;
