const multer = require("multer");
const pg = require("../config/PgConfig");
const redis = require("../config/RedisConfig");
const { Query } = require("pg");

const CreateBook = async (req, res) => {
  try {
    const { title, description, author_id, publication } = req.body;
    const cover_image = req.file ? req.file.path : null;

    if (!title || !author_id) {
      return res
        .status(400)
        .json({ success: false, messsage: "All field required" });
    }

    const query = `
        INSERT INTO books 
        (title, description , author_id , publication  , cover_image)
        VALUES
        ($1 , $2 , $3 , $4 , $5)
        RETURNING * 
        `;

    const value = [title, description, author_id, publication, cover_image];
    const { rows } = await pg.query(query, value);

    await redis.del("books:*");
    return res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    if (error.code === "23503") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid author_id: Author does not exist",
        });
    }
    console.log(error);
    
    return res
      .status(500)
      .json({
        success: false,
        message: "Error creating book",
        error: error.message,
      });
  }
};


const getBook = async (req,res)=>{
  const cacheKey= "books: all";

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached) });
    }
    const { rows } = await pg.query('SELECT * FROM books');
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return res.json({ success: true, data: rows });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching books', error: error.message });
  }
}

const getBookById = async (req , res)=>{
  const {id} = req.params

  try {
    const {rows} = await pg.query("SELECT * FROM books WHERE id = $1" , [id])
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    return res.json({ success: true, data: rows[0] });
      
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching book', error: error.message });
  }
}


const updateBook = async (req,res)=>{
  const { id } = req.params;
  const { title, description, author_id, publication } = req.body;
  const cover_image = req.file ? req.file.path : null;

  try {
    const query = `
    UPDATE books 
    SET title = $1 , description = $2 , author_id = $3 , publication = $4, cover_image = COALESCE($5, cover_image)
      WHERE id = $6
      RETURNING *
      `;

      const value = [title , description , author_id ,publication  ,cover_image , id]
      const {rows} = await pg.query(query,value)

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }

      await redisClient.del('books:*');
      return res.json({ success: true, data: rows[0] });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ success: false, message: 'Invalid author_id: Author does not exist' });
    }
    return res.status(500).json({ success: false, message: 'Error updating book', error: error.message });
  }
}

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    await redisClient.del('books:*');
    return res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting book', error: error.message });
  }
};

const searchBooks = async (req, res) => {
  const { q } = req.query;
  const cacheKey = `books:search:${q}`;

  if (!q) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached) });
    }

    const query = 'SELECT * FROM books WHERE title ILIKE $1';
    const { rows } = await pg.query(query, [`%${q}%`]);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching books', error: error.message });
  }
};

module.exports = { CreateBook, getBook, getBookById, updateBook, deleteBook, searchBooks };