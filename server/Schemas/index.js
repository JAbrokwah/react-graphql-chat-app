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
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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
            //TODO: based on jwt we could show this result + remove the user themselves from the result 
            //used to see the users the user has as friends or users in a lobby 
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
        signin: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const email = args.email;
                    const password = args.password;
                    // Use Mongoose to find a user by email in the MongoDB database
                    const existingUser = await User.findOne({ email: email });

                    if (!existingUser) {
                        throw new Error('User not found')
                    }
                    console.log(`Successfully called the user with email:${args.email} from MongoDB`)

                    const correctPassword = await bcrypt.compare(password, existingUser.password)

                    if (!correctPassword) {
                        throw new Error('Password is incorrect')
                    }

                    //to remove the hash from showing up
                    existingUser.password = null

                    const token = jwt.sign({ email : existingUser.email, id:existingUser._id }, JWT_SECRET, {
                    // const token = jwt.sign({ email : existingUser.email }, JWT_SECRET, {
                        expiresIn: "1h",
                    })

                    existingUser.token = token
                    //can be passed in context and used for calls

                    return existingUser;
                } catch (error) {
                    throw new Error(`Error fetching user with emails: ${args.email}: ${error.message}`);
                }
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
            //registration 
            async resolve(parent, args) {
                try {
                    //Validate input data to avoid running any further computations
                    if (args.firstName.trim() === '') throw new Error('Firstname cannot be empty')
                    if (args.lastName.trim() === '')
                        throw new Error('LastName must not be empty')
                    if (args.email.trim() === '')
                        throw new Error('Email must not be empty')

                    //check password same as duplicate if we decide to implement

                    //already handle the duplication but proactively checking if email 
                    //exist since it is unique / can be removed in order to optimize app/ could alternatively 
                    //just check in catch is error message has "E11000 duplicate key error collection"
                    //and customize error
                    const existingUser = await User.findOne({ email: args.email });
                    if (existingUser) {
                        throw new Error('A user with this email already exists');
                    }

                    //password hashing
                    args.password = await bcrypt.hash(args.password, 6)

                    const newUser = new User({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        password: args.password,
                    }); // Create a new user instance
                    await newUser.save(); // Save the user to the database
                    console.log(`Successfully created ${args.firstName} in MongoDB`)

                    const token = jwt.sign({ email : newUser.email }, JWT_SECRET, {
                        expiresIn: "1h",
                    })

                    newUser.token = token

                    return newUser;
                } catch (error) {
                    throw new Error(`Error creating a new user: ${error.message}`);
                }
            },
        },
        signup: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                confirmPassword: { type: GraphQLString },
            },
            //registration 
            async resolve(parent, args) {
                try {
                    //Validate input data to avoid running any further computations
                    if (args.firstName.trim() === '') throw new Error('Firstname cannot be empty')
                    if (args.lastName.trim() === '')
                        throw new Error('LastName must not be empty')
                    if (args.email.trim() === '')
                        throw new Error('Email must not be empty')

                    //already handle the duplication but proactively checking if email 
                    //exist since it is unique / can be removed in order to optimize app/ could alternatively 
                    //just check in catch is error message has "E11000 duplicate key error collection"
                    //and customize error
                    const existingUser = await User.findOne({ email: args.email });

                    if (existingUser) {
                        throw new Error('A user with this email already exists');
                    }

                    if (args.password != args.confirmPassword){
                        throw new Error("Password don't match");
                    }

                    //password hashing
                    args.password = await bcrypt.hash(args.password, 12)

                    const newUser = new User({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        password: args.password,
                    }); // Create a new user instance

                    const result = await newUser.save(); // Save the user to the database
                    console.log(`Successfully created ${args.firstName} in MongoDB`)

                    const token = jwt.sign({ email : result.email, id:result._id }, JWT_SECRET, {
                        // const token = jwt.sign({ email : existingUser.email }, JWT_SECRET, {
                            expiresIn: "1h",
                    })

                    result.token = token

                    console.log("saved user---->>")
                    console.log(result)

                    return result;
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