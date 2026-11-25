import express from "express";
import intercambiosRoutes from "./routes/intercambiosRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema, rootValue } from "./graphql/schema.js";
import { connectDB } from "./db/mongo.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/intercambios", intercambiosRoutes);
app.use("/users", usuariosRoutes);

app.all("/graphql", createHandler({ schema, rootValue }));

app.get("/status", (_req, res) => {
    res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

if (process.env.NODE_ENV !== "test") {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
