import { Injectable } from '@nestjs/common';
import { OrderByDirection } from 'firebase-admin/firestore';
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
    sort = '',
    single = false,
  ): Promise<{ data: T[]; hasNextPage: boolean; hasPrevPage: boolean }> {
    let sortParams: IOrderByParams = {
      fieldPath: 'createdAt',
      directionStr: 'desc',
    };
    if (sort) {
      const [fieldPath, directionStr] = sort.split(':');
      sortParams = {
        ...sortParams,
        fieldPath,
        directionStr: directionStr as OrderByDirection,
      };
    }
    console.log({ sortParams });

    const data = await repository.execute(
      queries,
      size,
      sortParams,
      single,
      async (q) => {
        return q.offset(page * size - size).limit(size);
      },
    );

    const nextData = await repository.execute(
      queries,
      1,
      sortParams,
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
