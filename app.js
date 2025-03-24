const express = require("express");
const { CreateUserTable } = require("./models/User");
const { CreateBookTable } = require("./models/Book");
const { CreateAutherTable } = require("./models/Author");
const { SetAdmin } = require("./SetAdmin");
const AuthRoute = require("./routes/AuthRoutes");
const BooksRouts =require('./routes/BooksRoute')
const AuthorRouts =require('./routes/AuthorsRoute')
const pg = require("./config/PgConfig");
const AuthMiddleware = require("./middleware/AuthMiddleware");

require("dotenv").config();

const app = express();
app.use(express.json());

const seedAuthors = async () => {
  try {
    const authorCheck = await pg.query('SELECT COUNT(*) FROM authors');
    if (parseInt(authorCheck.rows[0].count) === 0) {
      const query = `
        INSERT INTO authors (name, gender, profile)
        VALUES 
        ($1, $2, $3),
        ($4, $5, $6)
        RETURNING *`;
      const values = [
        'J.K. Rowling', 'female', 'Author of Harry Potter series',
        'George R.R. Martin', 'male', 'Author of A Song of Ice and Fire'
      ];
      const { rows } = await pg.query(query, values);
      console.log('Authors seeded successfully:', rows);
    } else {
      console.log('Authors table already seeded');
    }
  } catch (error) {
    console.error('Error seeding authors:', error);
  }
};


const DbInit = async () => {
  await CreateUserTable();
  await CreateBookTable();
  await CreateAutherTable();

  await pg.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");

  await SetAdmin();
  // await seedAuthors();
};
DbInit();

app.use("/api/auth", AuthRoute);
app.use('/api/book' , BooksRouts)
app.use('/api/author',AuthorRouts)

app.listen(3000, () => {
  console.log("Running");
});
