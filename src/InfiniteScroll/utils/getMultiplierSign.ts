export const getMultiplierSign = (value?: number | boolean): number => {
  if (typeof value === 'number') {
    return value < 0 ? -1 : 1;
  }

  return value ? -1 : 1;
};
