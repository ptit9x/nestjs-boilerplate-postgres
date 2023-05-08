import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { IPaginateParams } from '../common/app.interface';
import { IPagination } from './interfaces/IPagination';

export interface IBaseService<T> {
  create(entity: T): Promise<T>;
  getAll(): Promise<T[]>;
  getPagination(
    where: FindOptionsWhere<any> | FindOptionsWhere<any>[],
    params: IPaginateParams,
    relations?: string[],
  ): Promise<IPagination<T>>;
  get(
    id: string | number | string[] | number[] | FindOptionsWhere<T>,
  ): Promise<T>;
  update(id: string | number, dto: T): Promise<UpdateResult>;
  delete(id: string | number): Promise<boolean>;
  softDelete(id: string | number): Promise<boolean>;
}

export class BaseService<T> implements IBaseService<T> {
  constructor(private readonly genericRepository: Repository<T>) {}

  create(entity: any): Promise<T> {
    return this.genericRepository.save(entity);
  }

  getAll(): Promise<T[]> {
    try {
      return <Promise<T[]>>this.genericRepository.find();
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getPagination(
    where: FindOptionsWhere<any> | FindOptionsWhere<any>[],
    params: IPaginateParams,
    relations?: string[],
  ): Promise<IPagination<T>> {
    try {
      const page = params.page && params.page > 0 ? Number(params.page) : 1;
      const pageSize =
        params.pageSize && params.pageSize > 0 ? Number(params.pageSize) : 20;

      const options: FindManyOptions = {
        take: pageSize,
        skip: (page - 1) * pageSize,
        where,
      };
      if (relations?.length) {
        options.relations = relations;
      }
      if (params?.sortBy) {
        options.order = {
          [params.sortBy]: params.sortOrder == 'desc' ? 'DESC' : 'ASC',
        };
      }

      const [data, totalItem] = await this.genericRepository.findAndCount(
        options,
      );

      const totalPage =
        totalItem % pageSize === 0
          ? totalItem / pageSize
          : Math.floor(totalItem / pageSize) + 1;
      return {
        data,
        page,
        pageSize,
        totalPage,
        totalItem,
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  get(
    id: string | number | string[] | number[] | FindOptionsWhere<T>,
  ): Promise<T> {
    try {
      const where = { id } as FindOptionsWhere<any>;
      return <Promise<T>>this.genericRepository.findOneBy(where);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async delete(
    id: string | number | string[] | number[] | FindOptionsWhere<T>,
  ): Promise<boolean> {
    try {
      await this.genericRepository.delete(id);
      return true;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async softDelete(
    id: string | number | string[] | number[] | FindOptionsWhere<T>,
  ): Promise<boolean> {
    try {
      await this.genericRepository.softDelete(id);
      return true;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async update(
    id: string | number,
    entity: any,
    uniqueParams?: any,
  ): Promise<UpdateResult> {
    try {
      const where = { id } as FindOptionsWhere<any>;
      const found = await this.genericRepository.findOneBy(where);
      if (!found) {
        throw new NotFoundException(`Cannot find data with id: ${id}`);
      }
      if (uniqueParams) {
        const options = {
          ...uniqueParams,
          id: Not(id),
        };
        const exist = await this.genericRepository.countBy(options);
        if (exist) {
          throw new BadRequestException(`exist record in the database`);
        }
      }

      return this.genericRepository.update(id, entity);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
