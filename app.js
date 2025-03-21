const express = require("express");
const { CreateUserTable } = require("./models/User");
const { CreateBookTable } = require("./models/Book");
const { CreateAutherTable } = require("./models/Author");
const { SetAdmin } = require("./SetAdmin");
const AuthRoute = require("./routes/AuthRoutes");
const pg = require("./config/PgConfig");
const AuthMiddleware = require("./middleware/AuthMiddleware");

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

app.use("/api/auth" ,AuthRoute);

app.listen(3000, () => {
  console.log("Running");
});
