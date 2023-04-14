export interface IRole {
  id: number;
  name: string;
  type: number;
  isSuperAdmin?: boolean;
  createdBy?: string;
  status?: number;
  permissions?: {
    id: number;
    name: string;
  }[];
}
