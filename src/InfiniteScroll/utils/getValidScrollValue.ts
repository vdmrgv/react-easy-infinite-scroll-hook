import { getMultiplierSign } from './getMultiplierSign';

export type GetValidScrollValueArgs = {
  newValue: number;
  scrollSize: number;
  fallbackValue?: number;
};

export const getValidScrollValue = ({ newValue, scrollSize, fallbackValue }: GetValidScrollValueArgs): number => {
  const _fallbackValue = fallbackValue ?? scrollSize * getMultiplierSign(newValue);

  return Math.abs(newValue) > scrollSize ? _fallbackValue : newValue;
};
