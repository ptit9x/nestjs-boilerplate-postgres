export interface IAdminPayload {
  sub: number;
  email: string;
  fullName?: string;
}

export interface IUserPayload {
  sub: number;
  fullName: string;
  country?: string;
  status: string;
  statusSeller: string;
}

export interface IPaginateParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  status?: string;
  companyId?: string;
  roleIds?: string;
}
