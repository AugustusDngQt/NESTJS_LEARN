import { UserRole } from 'src/constants/enums.constant';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}
