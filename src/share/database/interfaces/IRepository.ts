import { IPaginateParams } from './IPagination';
export interface IFindByIdAndPopulateParams {
  id: string;
  populate: any;
  projections?: any;
}

export interface IFindByConditonAndPopulateParams {
  conditions: any;
  populate: any;
  projections?: any;
}

export interface IListParams {
  conditions?: any;
  projections?: any;
  paginate: IPaginateParams;
}

export interface IFindByIdAndUpdateParams {
  id: string;
  data: any;
  options?: any;
}

export interface IFindOneAndUpdateParams {
  conditions: any;
  data: any;
  options?: any;
}
