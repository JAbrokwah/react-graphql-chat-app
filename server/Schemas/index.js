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

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            // args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                //where we search database but for now local search
                return userData;
            },
        },
        getUserById: {
            type: UserType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                //where we search database but for now local search
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
    },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });