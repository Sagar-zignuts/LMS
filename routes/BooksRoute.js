const router = require('express').Router()
const {CreateBook , updateBook, getBook , getBookById , deleteBook , searchBooks} = require('../controllers/BookController')
const {AuthMiddleware, isAdmin, validateBook} = require('../middleware/AuthMiddleware')
const upload = require('../middleware/Uploads')

router.use(AuthMiddleware)

router.post('/' , isAdmin , validateBook,upload.single('cover_image'),CreateBook)
router.put('/:id' , isAdmin , validateBook,upload.single('cover_image'),updateBook)
router.delete('/:id', isAdmin , deleteBook)

router.get('/' , getBook)
router.get('/:id' , getBookById)
router.get('/serach', searchBooks)

module.exports = router