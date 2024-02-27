const { ObjectId } = require("mongodb");
const { client } = require("../config/mongoConnection");

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
    payOrder(orderId: ID): Order
}
`;

const resolvers = {
  Query: {
    getUserOrder: async (_, args, context) => {
      const { db, authentication } = context;

      const user = await authentication();

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

      const orderCollection = db.collection("orders");
      const bookCollection = db.collection("books");

      const findBook = await bookCollection.findOne({
        _id: new ObjectId(bookId),
      });

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
    payOrder: async (_, args, context) => {
      const { authentication, db } = context;

      await authentication();

      const session = client.startSession();

      try {
        const result = await session.withTransaction(async () => {
          /*
         PREDEFINED RULES
          1. find order by ID
            - if !findOrder => throw error
          2. check if order already been paid or nah
            - if "paid" => throw error
          3. check stock on book
            - if stock less than order quantity => throw error
          4. update status order and paidDate
          5. update stock book
          6. return updated order
         */

          const orderCollection = db.collection("orders");
          const bookCollection = db.collection("books");

          const findOrder = await orderCollection.findOne(
            {
              _id: new ObjectId(args.orderId),
            },
            { session }
          );
          if (!findOrder) throw new Error("Order not found");

          if (findOrder.status === "paid")
            throw new Error("order has been paid already!");

          const findBook = await bookCollection.findOne(
            {
              _id: findOrder.bookId,
            },
            { session }
          );

          if (findBook.stock < findOrder.quantity)
            throw new Error("Book stock is not sufficient");

          await orderCollection.updateOne(
            { _id: new ObjectId(args.orderId) },
            {
              $set: {
                status: "paid",
                paidDate: new Date(),
              },
            },
            { session }
          );

          await bookCollection.updateOne(
            { _id: findOrder.bookId },
            {
              $set: { stock: findBook.stock - findOrder.quantity },
            },
            { session }
          );

          const result = await orderCollection.findOne(
            {
              _id: new ObjectId(args.orderId),
            },
            { session }
          );

          return result;
        });

        return result;
      } finally {
        await session.endSession();
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
