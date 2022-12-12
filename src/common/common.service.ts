import { Injectable } from '@nestjs/common';
import {
  BaseFirestoreRepository,
  IEntity,
  IFireOrmQueryLine,
  IOrderByParams,
  //   IQueryBuilder,
} from 'fireorm';
// import { FirebaseService } from 'src/firebase/firebase.service';
@Injectable()
export class CommonService {
  //   constructor(private firebaseService: FirebaseService) {}
  async find<T extends IEntity>(
    repository: BaseFirestoreRepository<T>,
    queries: IFireOrmQueryLine[] = [],
    page = 1,
    size = 10,
    single = false,
    sort: IOrderByParams = {
      fieldPath: 'createdAt',
      directionStr: 'desc',
    },
  ): Promise<{ data: T[]; hasNextPage: boolean; hasPrevPage: boolean }> {
    const data = await repository.execute(
      queries,
      size,
      sort,
      single,
      async (q) => {
        return q.offset(page * size - size).limit(size);
      },
    );

    const nextData = await repository.execute(
      queries,
      1,
      sort,
      single,
      async (q) => {
        return q.offset(page * size + size).limit(1);
      },
    );

    return {
      data,
      hasPrevPage: page !== 1,
      hasNextPage: nextData.length > 0,
    };
  }
}
