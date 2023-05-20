import { nanoid } from 'nanoid';

export const genId = () => nanoid();

export const compare = (a = 0, b = 0) => a - b;
export const countUnique = (iterable = []) => {
  return new Set(iterable).size;
};
