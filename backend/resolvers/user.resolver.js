/*Resolvers are the functions that determine how to fetch the data associated with each field in the schema */
import {users} from '../dummyData/data.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
const userResolver = {
    Mutation:{
        signUp: async(_,{input},context) => {
            try {
                const {username,name,password,gender} = input;
                if(!username || !name || !password || !gender)
                {
                    throw new Error("All fields are required");
                }
                const existingUser = await user.findOne({username});
                if(existingUser){
                    throw new Error("Username already exists");
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                //Avatar from Avatar-Placeholder 
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    profilePicture: gender === "male"? boyProfilePic : girlProfilePic,
                    gender,
                })
                await newUser.save();
                await context.login(newUser);
                return newUser;
            } catch (err) {
                console.error("Error in signUp: ",err);
                throw new Error(err.message || "Internal server error");
            }
        },

        login: async(_,{input},context) => {
            try {
                const {username,password} = input;
                const {user} = await context.authenticate("graphql-local",{username,password});
                await context.login(user);
                return user;
            } catch (err) {
                console.error("Error in Login:",err);
                throw new Error(err.message || "Internal server error");
            }
        },

        logout: async(_,_,context) => {
            try {
                await context.logout();
                req.session.destroy((err) => {
                    if(err) throw err;
                })
                res.clearCookie("connect.sid");

                return {message: "Logged out Successfully"};
            } catch (err) {
                console.error("Error in Logout:",err);
                throw new Error(err.message || "Internal server error");
            }
        },

    },
    Query:{
        // users: (_,_,{req,res}) => {                                          // context is shared all over the resolvers, desctructured context with {req,res}
        //     // Fetch all users from the database(now hardcoded here)
        //     return users;
        // },
        authUser: async(_,_,context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (err) {
                console.error("Error in authUser:",err);
                throw new Error("Internal server error");
            }
        },

        user: async(_,{userId}) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch (err) {
                console.error("Error in user query:",err);
                throw new Error(err.message || "Error getting user");
            }
        },
        // TODO => ADD USER/TRANSACTION RELATION

        // user: (_, {userId}) => {
        //     // Fetch a single user by id from the database(now hardcoded here)
        //     return users.find((user) => user._id === userId);
        // },
    },
};

export default userResolver;