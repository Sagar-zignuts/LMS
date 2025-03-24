const e = require('express');
const pg = require('../config/PgConfig')
const redis = require('../config/RedisConfig')

const createAuthor = async (req , res)=>{
    
    const {name , gender , profile} = req.body
    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }
    
      try {
        const query = 'INSERT INTO authors (name, gender, profile) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, gender, profile];
        const { rows } = await pg.query(query, values);
    
        await redis.del('authors:*'); // Clear cache
        return res.status(201).json({ success: true, data: rows[0] });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating author', error: error.message });
      }
    };


const getAuthor = async (req,res)=>{
    const cacheKey ='author:all';
    try {
        const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached) });
    }

    const {rows} = await pg.query("SELECT * FROM authors")
    await redis.setEx(cacheKey, 3600, JSON.stringify(rows));
    return res.json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching authors', error: error.message });
    }
}

const getAuthorById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const { rows } = await pg.query('SELECT * FROM authors WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Author not found' });
      }
      res.json({ success: true, data: rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching author', error: error.message });
    }
  };

const updateAuthor= async (req,res)=>{
    const {id} = req.params
    
    const {name , gender , profile} = req.body

    try {
        const query = `
        UPDATE authors 
        SET name = $1 , gender = $2 , profile = $3
        WHERE id = $4`;

        const value = [name , gender , profile , id]
        const {rows} = await pg.query(query , value)

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Author not found' });
          }

          await redis.del('authors:*'); // Clear cache
    return  res.json({ success: true, data: rows[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating author', error: error.message });
    }
    
}

const deleteAuthor = async (req,res)=>{
    const {id} = req.params;
    const query = `
    DELETE FROM authors
    WHERE  id = $1
    RETURNING *`;
    const value = [id]
    try {
        const {rows}= await pg.query(query , value)

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Author not found' });
          }
          await redis.del('authors : *');
          return res.json({ success: true, message: 'Author deleted successfully' });
    } catch (error) {
        if (error.code === '23503') { // Foreign key violation (author linked to books)
            return res.status(409).json({ success: false, message: 'Cannot delete author with associated books' });
          }
          res.status(500).json({ success: false, message: 'Error deleting author', error: error.message });
    }
}

const searchAuthors = async (req, res) => {
    const { q } = req.query;
    const cacheKey = `authors:search:${q}`;
  
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
  
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json({ success: true, data: JSON.parse(cached) });
      }
  
      const query = 'SELECT * FROM authors WHERE name ILIKE $1';
      const { rows } = await pg.query(query, [`%${q}%`]);
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
      return res.json({ success: true, data: rows });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error searching authors', error: error.message });
    }
  };
  
  module.exports = { createAuthor, getAuthor, getAuthorById, updateAuthor, deleteAuthor, searchAuthors };