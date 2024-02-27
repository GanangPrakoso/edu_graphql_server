const { connect } = require("../config/mongoConnection");

const data = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    stock: 10,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/440px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
  },
  {
    title: "Fight Club",
    author: "Chuck Palahniuk",
    stock: 5,
    image: "https://upload.wikimedia.org/wikipedia/en/c/ce/Fightclubcvr.jpg",
  },
];

async function seedBook(params) {
  try {
    const db = await connect();
    await db.collection("books").insertMany(data);

    console.log("success seed books");
  } catch (error) {
    console.log(error, "<<<");
  }
}

module.exports = seedBook;
