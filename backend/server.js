require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const bookmarkRoutes = require('./routes/bookmarks');
const { nestedRouter: reviewsNested, topRouter: reviewsTop } = require('./routes/reviews');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/recipes/:recipeId/reviews', reviewsNested);
app.use('/api/reviews', reviewsTop);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
