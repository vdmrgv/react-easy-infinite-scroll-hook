import { ScrollAxisName, ScrollDirection } from './enums';

export type ScrollAxis<T> = {
  [ScrollAxisName.VERTICAL]?: T;
  [ScrollAxisName.HORIZONTAL]?: T;
};

export type ScrollDirectionState<T> = Partial<Record<ScrollDirection, T>>;
