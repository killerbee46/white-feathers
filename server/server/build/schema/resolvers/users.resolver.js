import { GraphQLError } from 'graphql';
import { Op } from 'sequelize';
import { User, UserRoles } from '../../models';
const UserResolvers = {
    Query: {
        me: async (parent, args, ctx) => {
            if (!ctx.userId) {
                throw new Error('Not authenticated');
            }
            return User.scope('withRelations').findByPk(ctx.userId);
        },
        getUserList: async (parent, args, ctx) => {
            // if (!ctx.token?.username) {
            if (!ctx.userId) {
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN'
                    }
                });
            }
            const { search, pagination, sort } = args;
            let query = {
                offset: 0,
                limit: 5,
                raw: true,
                distinct: true
            };
            //by default query is paginated to limit 5 items
            if (pagination) {
                query.limit = pagination.items;
                query.offset = pagination.items * (pagination.page - 1);
            }
            if (search) {
                query.where = {
                    [Op.or]: [
                        search.name ? { name: search.name } : null,
                        search.email ? { email: search.email } : null
                    ]
                };
            }
            if (sort) {
                query.order = [[sort, 'ASC']];
            }
            return await User.scope('withRelations').findAll();
        },
        user: async (parent, args, ctx) => {
            const id = args.id;
            return await User.scope('withRelations').findByPk(id);
        }
    },
    Mutation: {
        createUser: async (parent, args, ctx) => {
            const returnValues = await User.create(args?.input);
            return returnValues;
        },
        updateUser: async (parent, args, ctx) => {
            const id1 = args.input.id;
            const updatedValues = await User.update({ ...args?.input }, { where: { id: id1 } });
            return updatedValues;
        },
        deleteUser: async (parent, args, ctx) => {
            await ctx.models.User.delete(args?.input.id);
            return true;
        },
        assignUserRole: async (parent, args, ctx) => {
            const { userId, roleId } = args;
            await UserRoles.create({ userId, roleId });
            return User.findByPk(userId);
        }
    }
    // User: {
    //   async roles(user) {
    //     return user.getRole();
    //   },
    //   async userRoles(user) {
    //     return user.getUserRoles;
    //   }
    // }
};
export default UserResolvers;
