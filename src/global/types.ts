export type PaginationResult<T> = {
  meta: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    size: number;
    completedSession?: number;
  };

  data: T[];
};
