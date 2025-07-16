import { User } from './users.model';
import { Dummy } from './dummy.model';
import { AppSetting } from './appSetting.model';
import { Roles } from './roles.model';
import { UserRoles } from './userRoles.model';
export { User, Dummy, AppSetting, Roles, UserRoles };
export default [User, Dummy, AppSetting, Roles, UserRoles];
export const allModules = {
    User,
    Dummy,
    AppSetting,
    Roles,
    UserRoles
};
