export const getArrayNumberEnum = (enumObj: {
  [key: string]: string | number;
}) => {
  return Object.values(enumObj).filter(
    (item) => typeof item === 'number',
  ) as number[];
};
