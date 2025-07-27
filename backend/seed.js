console.log("✅ Pokrećem seed.js fajl");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const User = require("./models/User");
const Ad = require("./models/Ad");

dotenv.config();

// Kategorije i proizvodi sa tačnim slikama
const productsWithImages = {
  clothing: [
    { title: "T-shirt", image: "/uploads/t-shirt.JPEG" },
    { title: "Jeans", image: "/uploads/jeans.JPEG" },
    { title: "Jacket", image: "/uploads/jacket.JPEG" },
    { title: "Sweater", image: "/uploads/sweater.JPEG" },
  ],
  tools: [
    { title: "Hammer", image: "/uploads/hammer.JPEG" },
    { title: "Screwdriver", image: "/uploads/screwdriver.JPEG" },
    { title: "Drill", image: "/uploads/drill.JPEG" },
    { title: "Wrench", image: "/uploads/wrench.JPEG" },
  ],
  sports: [
    { title: "Football", image: "/uploads/football.JPEG" },
    { title: "Tennis Racket", image: "/uploads/tennis-racket.JPEG" },
    { title: "Basketball", image: "/uploads/basketball.JPEG" },
    { title: "Skates", image: "/uploads/skates.JPEG" },
  ],
  accessories: [
    { title: "Watch", image: "/uploads/watch.JPEG" },
    { title: "Sunglasses", image: "/uploads/sunglasses.JPEG" },
    { title: "Backpack", image: "/uploads/backpack.JPEG" },
    { title: "Belt", image: "/uploads/belt.JPEG" },
  ],
  furniture: [
    { title: "Chair", image: "/uploads/chair.JPEG" },
    { title: "Table", image: "/uploads/table.JPEG" },
    { title: "Sofa", image: "/uploads/sofa.JPEG" },
    { title: "Bookshelf", image: "/uploads/bookshelf.JPEG" },
  ],
  pets: [
    { title: "Dog Leash", image: "/uploads/dog-leash.JPEG" },
    { title: "Cat Bed", image: "/uploads/cat-bed.JPEG" },
    { title: "Bird Cage", image: "/uploads/bird-cage.JPEG" },
    { title: "Aquarium", image: "/uploads/aquarium.JPEG" },
  ],
  games: [
    { title: "Chess Set", image: "/uploads/chess-set.JPEG" },
    { title: "PS5 Controller", image: "/uploads/ps5-controller.JPEG" },
    { title: "Puzzle", image: "/uploads/puzzle.JPEG" },
    { title: "Monopoly", image: "/uploads/monopoly.JPEG" },
  ],
  books: [
    { title: "Crime Novel", image: "/uploads/crime-novel.JPEG" },
    { title: "History Book", image: "/uploads/history-book.JPEG" },
    { title: "Sci-Fi Book", image: "/uploads/scifi-book.JPEG" },
    { title: "Romance Novel", image: "/uploads/romance-novel.JPEG" },
  ],
  technology: [
    { title: "Laptop", image: "/uploads/laptop.JPEG" },
    { title: "Smartphone", image: "/uploads/smartphone.JPEG" },
    { title: "Monitor", image: "/uploads/monitor.JPEG" },
    { title: "Keyboard", image: "/uploads/keyboard.JPEG" },
  ],
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Povezan sa bazom.");

    // Brisanje starih podataka
    await User.deleteMany();
    await Ad.deleteMany();
    console.log("Stari podaci obrisani.");

    // Dodavanje korisnika
    const users = [];
    for (let i = 0; i < 10; i++) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = new User({
        username: `user${i}`,
        password: hashedPassword,
        phone: faker.phone.number(),
      });
      await user.save();
      users.push(user);
    }
    console.log("Korisnici dodani.");

    // Dodavanje oglasa
    const allCategories = Object.keys(productsWithImages);

    for (let i = 0; i < 100; i++) {
      const category = faker.helpers.arrayElement(allCategories);
      const product = faker.helpers.arrayElement(productsWithImages[category]);

      const ad = new Ad({
        title: product.title,
        description: faker.lorem.sentences(),
        imageUrl: product.image,
        price: faker.number.int({ min: 10, max: 1000 }),
        category: category,
        user: faker.helpers.arrayElement(users)._id,
        city: faker.location.city(),
      });

      await ad.save();
    }

    console.log("Oglasi dodani.");
    process.exit();
  } catch (err) {
    console.error("Greška prilikom seed-ovanja:", err.message);
    process.exit(1);
  }
}

seed();
