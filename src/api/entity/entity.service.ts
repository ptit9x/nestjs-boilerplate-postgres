import { Injectable } from '@nestjs/common';

import { EntityRepository } from './entity.repository';

@Injectable()
export class EntityService {
  constructor(private readonly entityRepository: EntityRepository) {}

  get() {
    return {
      message: 'OK Test',
    };
  }
}
