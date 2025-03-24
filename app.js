const express = require("express");
const { CreateUserTable } = require("./models/User");
const { CreateBookTable } = require("./models/Book");
const { CreateAutherTable } = require("./models/Author");
const { SetAdmin } = require("./SetAdmin");
const AuthRoute = require("./routes/AuthRoutes");
const BooksRouts = require("./routes/BooksRoute");
const AuthorRouts = require("./routes/AuthorsRoute");
const pg = require("./config/PgConfig");
require("dotenv").config();

const app = express();
app.use(express.json());

const DbInit = async () => {
  await CreateUserTable();
  await CreateBookTable();
  await CreateAutherTable();

  await pg.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");

  await SetAdmin();
};
DbInit();

app.use("/api/auth", AuthRoute);
app.use("/api/book", BooksRouts);
app.use("/api/author", AuthorRouts);

app.listen(process.env.PORT, () => {
  console.log("Running");
});