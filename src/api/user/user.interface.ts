import { UserStatus } from './user.constant';

export interface ICreateUser {
  name: string;
  email: string;
  expired_date: string;
  password?: string;
  country?: string;
  city?: string;
  phone?: string;
  postalCode?: number;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
