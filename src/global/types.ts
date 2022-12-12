export type PaginationResult<T> = {
  meta: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    size: number;
  };
  data: T[];
};
