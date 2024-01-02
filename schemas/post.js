const typeDefs = `#graphql
type Post {  
    _id: ID
    userId: String
    title: String
    caption: String
    tags: [String]
}

type Query {
    # write query here
}
`;
