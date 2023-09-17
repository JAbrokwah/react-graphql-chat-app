const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
} = graphql;
const userData = require("../TestData.json");

const UserType = require("./TypeDefs/UserType.js");

const User = require("./TypeDefs/UserTypeDB");


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),

            resolve(parent, args) {
                // local search
                return userData;

            },
        },
        getAllUsersDB: {
            type: new GraphQLList(UserType),

            async resolve(parent, args) {
                try {
                    // Use Mongoose to fetch all users from the MongoDB database
                    const users = await User.find();
                    console.log(`Successfully called all users in MongoDB`)
                    return users;
                } catch (error) {
                    throw new Error(`Error fetching users: ${error.message}`);
                }
            },
        },
        getUserById: {
            type: UserType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const userId = args.id;
                // Find the user with the matching id in the userData array
                const user = userData.find(user => user.id === userId);
                return user;
            },
        },
        getUserByName: {
            type: UserType,
            args: {
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                //where we search database but for now local search (Find,Select blah blah )
                const userName = args.name;
                // Find the user with the matching id in the userData array
                const user = userData.find(user => user.firstName === userName);
                return user;
            },
        },
        getUserByNameDB: {
            type: UserType,
            args: {
                name: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const userName = args.name;
                    // Use Mongoose to find a user by name in the MongoDB database
                    const user = await User.findOne({ firstName: userName });
                    console.log(`Successfully called ${args.name} from MongoDB`)
                    return user;
                } catch (error) {
                    throw new Error(`Error fetching user by ${args.name}: ${error.message}`);
                }
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                userData.push({
                    id: userData.length + 1,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    password: args.password,
                });
                return args;
            },
        },
        createUserDB: {
            type: UserType,

            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    const newUser = new User({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        password: args.password,
                    }); // Create a new user instance
                    await newUser.save(); // Save the user to the database
                    console.log(`Successfully created ${args.firstName} in MongoDB`)
                    return newUser;
                } catch (error) {
                    throw new Error(`Error creating a new user: ${error.message}`);
                }
            },
        },
        deleteUser: {
            type: GraphQLString,
            args: {
                name: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userName = args.name;
                const userIndex = userData.findIndex(user => user.firstName === userName);
                if (userIndex !== -1) {
                    // If the user with the specified firstName is found, remove it from the array
                    userData.splice(userIndex, 1);
                    return `User with firstName "${userName}" has been deleted.`;
                }
                return `User with firstName "${userName}" not found`;
            },
        },
        deleteUserDB: {
            type: GraphQLString,
            args: {
                name: { type: GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    const userName = args.name;
                    // delete a user by name 
                    const result = await User.deleteOne({ firstName: userName });
                    if (result.deletedCount > 0) {
                        return `User with firstName "${userName}" has been deleted.`;
                    } else {
                        return `User with firstName "${userName}" not found`;
                    }
                } catch (error) {
                    throw new Error(`Error deleting user by name: ${error.message}`);
                }
            },
        },
    },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });