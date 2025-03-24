const router = require('express').Router()
const {createAuthor,deleteAuthor,getAuthor,getAuthorById,searchAuthors,updateAuthor} = require('../controllers/AuthorController')

const {AuthMiddleware , isAdmin, validateAuthor} = require('../middleware/AuthMiddleware')

router.use(AuthMiddleware)

router.post('/' , isAdmin  ,validateAuthor,createAuthor)
router.put('/:id' , isAdmin ,validateAuthor, updateAuthor)
router.delete('/:id' , isAdmin , deleteAuthor)

router.get('/' , getAuthor)
router.get('/search',  searchAuthors)
router.get('/:id' , getAuthorById)

module.exports = router
