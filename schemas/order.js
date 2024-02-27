const { ObjectId } = require("mongodb");

const typeDefs = `#graphql
type Order {
    _id: ID
    bookId: ID
    status: String
    quantity: Int
    orderDate: String
    paidDate: String
    userId: ID
}

type Query {
    getUserOrder: [Order]
}

type Mutation {
    createOrder(bookId: ID, quantity: Int): Order
}
`;

const resolvers = {
  Query: {
    getUserOrder: async (_, args, context) => {
      const { db, authentication } = context;

      const user = authentication();

      const orderCollection = db.collection("orders");

      const userOrders = await orderCollection
        .find({ userId: user.userId })
        .toArray();

      return userOrders;
    },
  },
  Mutation: {
    createOrder: async (_, args, context) => {
      const { db, authentication } = context;
      const { bookId, quantity } = args;

      const user = await authentication();

      console.log(user, "<<<<");

      const orderCollection = db.collection("orders");
      const bookCollection = db.collection("books");

      const findBook = await bookCollection.findOne({
        _id: new ObjectId(bookId),
      });

      console.log(findBook, "<<<");

      if (findBook.stock < quantity)
        throw new Error("Book stock is not enough");

      const newOrder = {
        bookId: new ObjectId(bookId),
        status: "unpaid",
        quantity: quantity,
        orderDate: new Date(),
        paidDate: null,
        userId: user.userId,
      };

      await orderCollection.insertOne(newOrder);

      return newOrder;
    },
  },
};

module.exports = { typeDefs, resolvers };
