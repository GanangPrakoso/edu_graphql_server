const { ObjectId } = require("mongodb");
const { connect } = require("../config/mongoConnection");

const posts = [
  {
    userId: "1",
    title: "Hari ini saya pergi tamasya",
    caption: "lumayan seru",
    tags: ["holiday", "fun"],
  },
  {
    userId: "1",
    title: "Hari ini saya ga kemana-mana walaupun libur",
    caption: "karena saya sakit",
    tags: ["holiday", "sick", "no_fun"],
  },
  {
    userId: "1",
    title: "Andai aku jadi semut",
    caption: "penasaran aja",
    tags: ["curious"],
  },
];

async function seedPosts() {
  try {
    const dataPosts = posts.map((el) => {
      el.userId = new ObjectId(el.userId); //! ObjectId important for reference field
      return el;
    });

    const db = await connect();
    await db.collection("posts").insertMany(dataPosts);

    console.log("success seed posts");
  } catch (error) {
    console.log(error, "<<< error seed posts");
  }
}

seedPosts();
