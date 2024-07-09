/*Resolvers are the functions that determine how to fetch the data associated with each field in the schema */
import {users} from '../dummyData/data.js';
const userResolver = {
    Query:{
        users: (_,_,{req,res}) => {                                          // context is shared all over the resolvers, desctructured context with {req,res}
            // Fetch all users from the database(now hardcoded here)
            return users;
        },
        user: (_, {userId}) => {
            // Fetch a single user by id from the database(now hardcoded here)
            return users.find((user) => user._id === userId);
        },
    },
    Mutation:{},
};

export default userResolver;