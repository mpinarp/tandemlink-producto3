import { connectDB } from "../src/db/mongo.js";
import {
    usuariosCollection,
    intercambiosCollection,
} from "../src/db/collections.js";
import { usuarios, intercambios } from "../src/data/memoria.js";

const seed = async () => {
    await connectDB();
    if ((await usuariosCollection.countDocuments()) === 0) {
        await usuariosCollection.insertMany(usuarios);
    }
    if ((await intercambiosCollection.countDocuments()) === 0) {
        await intercambiosCollection.insertMany(intercambios);
    }
    console.log("Seed completed");
    process.exit();
};

seed();
