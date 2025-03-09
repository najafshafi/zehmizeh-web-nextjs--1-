export const rangeOfNumber = (n: number, range: number = 5) => {
  const start = n - (n % range);
  const end = start + range;
  return [start, end];
};
