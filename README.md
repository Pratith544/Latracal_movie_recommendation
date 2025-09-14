# Latracal Movie Recommendation 🎬

A full-stack movie recommendation platform that allows users to browse, review, and manage their watchlist.  
Built with **React + TypeScript (frontend)** and **Node.js + Express + MongoDB (backend)**.  

👉 **Live Demo**: [Latracal Movie Recommendation](https://latracal-movie-recommendation.vercel.app/)

---

## 🚀 Features
- User authentication (login/register)
- Browse movies and view details
- Add movies to personal watchlist
- Rate and review movies
- Light/Dark mode support

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Pratith544/Latracal_movie_recommendation.git
cd Latracal_movie_recommendation/project
2. Install Dependencies
For both frontend and backend:

bash
Copy code
# Install frontend dependencies
npm install

# Move to server folder
cd server
npm install
3. Start the Application
Frontend (Vite):

bash
Copy code
npm run dev
Backend (Express):

bash
Copy code
cd server
npm start
The frontend will run on http://localhost:5173 and the backend on http://localhost:5000.

🌐 API Documentation
Authentication
POST /api/auth/register → Register a new user

POST /api/auth/login → User login

Movies
GET /api/movies → Get all movies

GET /api/movies/:id → Get movie by ID

Reviews
POST /api/reviews → Add a review

GET /api/reviews/:movieId → Get reviews for a movie

Watchlist
POST /api/watchlist → Add to watchlist

GET /api/watchlist → Get user’s watchlist

🗄️ Database Setup
This project uses MongoDB.

Install MongoDB locally, or use MongoDB Atlas.

Create a database called:

nginx
Copy code
latracal_movies
Collections will be auto-created:

users

movies

reviews

watchlists

🔑 Environment Variables
Create a .env file in the server folder with the following:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
(Never commit your real .env — add it to .gitignore!)

You can create a .env.example file to share variable names without exposing values.

📝 Additional Notes & Design Decisions
Frontend built with React + Vite + TailwindCSS + TypeScript

Backend built with Node.js + Express

Authentication handled with JWT

Database: MongoDB with Mongoose ODM

Architecture: Clear separation of concerns with routes, models, and middleware

Environment-specific configs are managed via .env

📌 Future Enhancements
Personalized recommendations using ML/AI

Social features (follow friends, share watchlists)

Movie trailers integration

👨‍💻 Author
Developed by Pratith Bhat
