const bcrypt = require("bcryptjs");
const { connect } = require("../config/mongoConnection");

const users = [
  {
    username: "user1",
    email: "user1@mail.com",
    password: "user1",
    address: {
      street: "elm street",
      number: 666,
    },
  },
  {
    username: "user2",
    email: "user2@mail.com",
    password: "user2",
    address: {
      street: "paper street",
      number: 1537,
    },
  },
];

async function seedUsers() {
  try {
    const dataUser = users.map((el) => {
      el.password = bcrypt.hashSync(el.password, 8);

      return el;
    });

    const db = await connect();
    await db.collection("users").insertMany(dataUser);

    console.log("success seed users");
  } catch (error) {
    console.log(error, "<<<");
  }
}

seedUsers();
