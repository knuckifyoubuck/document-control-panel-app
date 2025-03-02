import { UserRole } from '@document-control-app/core/enums/user-role.enum';

export interface UserResDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}
