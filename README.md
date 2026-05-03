# RecipeShare — Full-Stack Recipe Sharing App

A full-stack recipe sharing platform built with React (Vite), Node.js/Express, MongoDB, and Tailwind CSS.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, React Router v6, Axios, Tailwind CSS |
| Backend  | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth     | JWT (jsonwebtoken + bcryptjs) |
| Images   | Multer + Cloudinary |

---

## Prerequisites

- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB** — Local install or [MongoDB Atlas](https://cloud.mongodb.com) (free tier works)
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com) (free tier works)

---

## Project Setup

### 1. Clone / open the project

```bash
cd recipe-app
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/recipe-app
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## Running the App

### Backend

```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

### Frontend (separate terminal)

```bash
cd frontend
npm run dev
# App opens on http://localhost:5173
```

### Run both concurrently (from project root)

Install `concurrently` once:

```bash
npm init -y
npm install concurrently
```

Add to root `package.json` scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  }
}
```

Then:

```bash
npm run dev
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/recipes` | — | List recipes (page, cuisine, diet, sort) |
| GET | `/api/recipes/search?q=` | — | Full-text search |
| GET | `/api/recipes/:id` | — | Recipe detail |
| POST | `/api/recipes` | ✓ | Create recipe (multipart/form-data) |
| PUT | `/api/recipes/:id` | ✓ owner | Update recipe |
| DELETE | `/api/recipes/:id` | ✓ owner | Delete recipe |
| GET | `/api/recipes/:id/reviews` | — | List reviews |
| POST | `/api/recipes/:id/reviews` | ✓ | Add review |
| DELETE | `/api/reviews/:id` | ✓ owner | Delete review |
| GET | `/api/users/:id` | — | Public profile |
| GET | `/api/users/:id/recipes` | — | User's recipes |
| POST | `/api/users/:id/follow` | ✓ | Follow user |
| DELETE | `/api/users/:id/follow` | ✓ | Unfollow user |
| GET | `/api/bookmarks` | ✓ | My bookmarks |
| POST | `/api/bookmarks/:recipeId` | ✓ | Bookmark recipe |
| DELETE | `/api/bookmarks/:recipeId` | ✓ | Remove bookmark |

---

## Features

- JWT authentication with protected routes
- Recipe creation with image upload (Cloudinary)
- Ingredient builder and step-by-step instructions
- Full-text search across title, description, ingredients
- Filter by cuisine, diet, and sort by newest/rating
- Star ratings and reviews (one review per user per recipe)
- Bookmark/save recipes
- User profiles with follower/following system
- Responsive Tailwind CSS design
