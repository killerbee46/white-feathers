export const userTypeDefs = `
scalar Date

input Pagination {
    page: Int
    items: Int
}
input UserFilter {
     email: String
     name : String 

}


type User {
    id:ID
    name : String 
    email: String
    password: String
    otp: String
    otpCount: Int
    dob: Date
    phoneNo: String
    address: String
    userName: String
    roles: [Roles]
}



type Query{
      me: User
    user(id: ID!): User!
    getUserList(search:UserFilter, pagination:Pagination, sort: String): [User]
}



input CreateUserInput{
    
   name : String 
    email: String
    password: String
    otp: String
    dob: Date
    phoneNo: String
    address: String
    userName: String

}

input UpdateUserInput{
      name : String 
    email: String
    password: String
    otp: String
    dob: Date
    phoneNo: String
    address: String
    userName: String


}

input DeleteUserInput{
    id:ID
}


type Mutation{
    createUser(input:CreateUserInput! ): User
    updateUser(input:UpdateUserInput!): User
    deleteUser(input:DeleteUserInput!): Boolean
    assignUserRole(userId: Int!, roleId: Int!): User
}

`;
