const router = require('express').Router()
const {CreateBook , updateBook, getBook , getBookById , deleteBook , searchBooks} = require('../controllers/BookController')
const {AuthMiddleware, isAdmin, validateBook} = require('../middleware/AuthMiddleware')
const upload = require('../middleware/Uploads')

router.use(AuthMiddleware)

router.post('/' , isAdmin , upload.single('cover_image'),validateBook,CreateBook)
router.put('/:id' , isAdmin , upload.single('cover_image'),validateBook,updateBook)
router.delete('/:id', isAdmin , deleteBook)

router.get('/' , getBook)
router.get('/search', searchBooks)
router.get('/:id' , getBookById)

module.exports = router