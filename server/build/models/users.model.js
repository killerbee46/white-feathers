var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Model, Table, Column, DataType, Index, AutoIncrement, BeforeCreate, BeforeUpdate, BelongsToMany, Scopes } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import { Roles } from './roles.model';
import { UserRoles } from './userRoles.model';
let User = class User extends Model {
    constructor() {
        super(...arguments);
        this.validPassword = async (password, hash) => {
            return await bcrypt.compareSync(password, hash);
        };
    }
    static beforeCreateHook(user) {
        if (user.password) {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
        }
        if (user.otp) {
            const salt = bcrypt.genSaltSync(10);
            user.otp = bcrypt.hashSync(user.otp, salt);
        }
    }
};
__decorate([
    AutoIncrement,
    Column({
        field: 'id',
        primaryKey: true,
        type: DataType.INTEGER
    }),
    Index({
        name: 'PRIMARY',
        using: 'BTREE',
        order: 'ASC',
        unique: true
    })
], User.prototype, "id", void 0);
__decorate([
    Column({
        field: 'name',
        type: DataType.STRING(80)
    })
], User.prototype, "name", void 0);
__decorate([
    Column({
        field: 'email',
        type: DataType.STRING(80),
        unique: true
    })
], User.prototype, "email", void 0);
__decorate([
    Column({
        field: 'address',
        type: DataType.STRING(80)
    })
], User.prototype, "address", void 0);
__decorate([
    Column({
        field: 'phoneNo',
        type: DataType.STRING(80)
    })
], User.prototype, "phoneNo", void 0);
__decorate([
    Column({
        field: 'dob',
        type: DataType.DATE
    })
], User.prototype, "dob", void 0);
__decorate([
    Column({
        field: 'password',
        type: DataType.STRING(80)
    })
], User.prototype, "password", void 0);
__decorate([
    Column({
        field: 'userName',
        type: DataType.STRING(80)
    })
], User.prototype, "userName", void 0);
__decorate([
    Column({
        field: 'otp',
        type: DataType.STRING(80)
    })
], User.prototype, "otp", void 0);
__decorate([
    Column({
        field: 'otpCount',
        type: DataType.STRING(80)
    })
], User.prototype, "otpCount", void 0);
__decorate([
    BelongsToMany(() => Roles, () => UserRoles)
], User.prototype, "roles", void 0);
__decorate([
    BeforeCreate,
    BeforeUpdate
], User, "beforeCreateHook", null);
User = __decorate([
    Scopes(() => ({
        withRelations: {
            include: {
                as: 'roles',
                model: Roles,
                required: false,
                through: { attributes: [] },
                attributes: ['id', 'name']
            }
        }
    })),
    Table({
        tableName: 'user-profile',
        timestamps: true,
        paranoid: true
    })
], User);
export { User };
