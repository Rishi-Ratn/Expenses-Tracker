/* TypeDefs define the shape of the data available in the GraphQL API, They specify the types of objects that can be queried and the relationships between them. */

const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        password: String!
        profilePicture: String
        gender: String!
    }

    type Query {
        # users: [User!]          # fetch all users, array of users, each user cannot be null
        authUser: User          #if user not authenticated, then null response therefore not required 
        user(userId:ID!): User
    }
    
    type Mutation {
        signUp(input: SignUpInput!): User      # sign up Mutation takes input as signUpInput and returns User
        login(input: LoginInput!): User
        logout: LogoutResponse
    }

    input SignUpInput {
        username: String!
        name: String!
        password: String!
        gender: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type LogoutResponse {
        message: String!
    }
`

export default userTypeDef;