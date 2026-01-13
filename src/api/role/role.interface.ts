export interface IRole {
  id: number;
  name: string;
  type: number;
  createdBy?: string;
  status?: number;
  permissions?: {
    id: number;
    name: string;
  }[];
}
