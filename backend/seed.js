console.log("✅ Pokrećem seed.js fajl");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const User = require("./models/User");
const Ad = require("./models/Ad");

dotenv.config();

const categories = [
  "clothing", "tools", "sports", "accessories",
  "furniture", "pets", "games", "books", "technology"
];


async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Obriši postojeće 
        await User.deleteMany();
        await Ad.deleteMany();

        console.log("Stari podaci obrisani.");

        // Dodaj 10 korisnika
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

        // Dodaj 100 oglasa
        for (let i = 0; i < 100; i++) {
            const ad = new Ad({
                title: faker.commerce.productName(),
                description: faker.lorem.sentences(),
                imageUrl: faker.image.url(),
                price: faker.number.int({ min: 10, max: 1000 }),
                category: faker.helpers.arrayElement(categories),
                user: faker.helpers.arrayElement(users)._id,
                city: faker.location.city(),
            });
            await ad.save();
        }

        console.log("Oglasi dodani.");
        process.exit();

    } catch (err) {
        console.error("Greška prilikom seed-ovanja: ", err.message);
        process.exit(1);
    }
}

seed();
