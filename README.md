# LMS

# Library Management System

## Prerequisites
- Node.js
- PostgreSQL
- Multer
- Redis
- Nodemailer
- Gmail account for email sending

## Installation
1. Clone the repository
2. Run `npm install`
3. Set up `.env` file with required variables
4. Create PostgreSQL database `LMS`
5. Start Redis server
6. Run `npm start` or `npm run dev` or `nodemon fileName.js`for development


## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/books - Create a book (Admin only)
- GET /api/books - Get all books
- POST /api/authors - Create an author (Admin only)

## Dependencies
- See package.json for full list


## Notes
- Use Postman to test API endpoints
- Upload folder must exist for cover images
- Admin role must be manually set in database initially

To start the project 

- Start Redis server
- Start Pg server
- Start Redis Commander
- When pull the project , set proper .env file
- And create your own upload folder 
- and then run command `npm i`