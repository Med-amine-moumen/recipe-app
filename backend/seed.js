require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Review = require('./models/Review');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Recipe.deleteMany({});
  await Review.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  const [chef1, chef2, chef3] = await User.insertMany([
    { name: 'Fatima Zahra', email: 'fatima@example.com', passwordHash, bio: 'Moroccan food lover and home chef.' },
    { name: 'Marco Rossi', email: 'marco@example.com', passwordHash, bio: 'Italian cuisine enthusiast from Milan.' },
    { name: 'Amina Benali', email: 'amina@example.com', passwordHash, bio: 'Sharing healthy recipes from the Maghreb.' },
  ]);

  const recipes = await Recipe.insertMany([
    {
      authorId: chef1._id,
      title: 'Classic Moroccan Tagine',
      description: 'A slow-cooked savory stew made with lamb, preserved lemons, and olives. Rich in spices and full of depth, this is the heart of Moroccan cuisine.',
      ingredients: [
        { name: 'Lamb shoulder', amount: '1', unit: 'kg' },
        { name: 'Onion', amount: '2', unit: 'large' },
        { name: 'Preserved lemons', amount: '2', unit: 'pieces' },
        { name: 'Green olives', amount: '100', unit: 'g' },
        { name: 'Ras el hanout', amount: '2', unit: 'tsp' },
        { name: 'Cumin', amount: '1', unit: 'tsp' },
        { name: 'Turmeric', amount: '1', unit: 'tsp' },
        { name: 'Olive oil', amount: '3', unit: 'tbsp' },
        { name: 'Fresh cilantro', amount: '1', unit: 'bunch' },
        { name: 'Garlic', amount: '4', unit: 'cloves' },
      ],
      steps: [
        { order: 1, instruction: 'Cut the lamb into large chunks and season with ras el hanout, cumin, turmeric, salt, and pepper.' },
        { order: 2, instruction: 'Heat olive oil in the tagine or a heavy pot over medium heat. Brown the lamb on all sides, then set aside.' },
        { order: 3, instruction: 'Sauté the sliced onions and minced garlic until softened and golden.' },
        { order: 4, instruction: 'Return the lamb to the pot, add 200ml of water, and bring to a gentle simmer.' },
        { order: 5, instruction: 'Cover and cook on low heat for 1.5 hours until the lamb is tender.' },
        { order: 6, instruction: 'Add the preserved lemon quarters and olives, cook for another 15 minutes.' },
        { order: 7, instruction: 'Garnish with fresh cilantro and serve hot with Moroccan bread or couscous.' },
      ],
      prepTime: 20,
      cookTime: 105,
      cuisine: 'Moroccan',
      diet: 'none',
      avgRating: 4.8,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&h=600&fit=crop',
    },
    {
      authorId: chef1._id,
      title: 'Moroccan Harira Soup',
      description: 'A hearty tomato-based soup loaded with lentils, chickpeas, and fragrant spices. Traditionally served during Ramadan, but perfect any time of year.',
      ingredients: [
        { name: 'Tomatoes', amount: '4', unit: 'large' },
        { name: 'Red lentils', amount: '150', unit: 'g' },
        { name: 'Chickpeas (canned)', amount: '400', unit: 'g' },
        { name: 'Celery stalks', amount: '2', unit: 'pieces' },
        { name: 'Onion', amount: '1', unit: 'large' },
        { name: 'Cinnamon', amount: '1', unit: 'tsp' },
        { name: 'Ginger', amount: '1', unit: 'tsp' },
        { name: 'Turmeric', amount: '0.5', unit: 'tsp' },
        { name: 'Fresh parsley', amount: '1', unit: 'bunch' },
        { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
        { name: 'Flour', amount: '2', unit: 'tbsp' },
      ],
      steps: [
        { order: 1, instruction: 'Blend the tomatoes into a smooth purée and set aside.' },
        { order: 2, instruction: 'Sauté diced onion and celery in olive oil until softened.' },
        { order: 3, instruction: 'Add spices (cinnamon, ginger, turmeric, pepper) and stir for 1 minute.' },
        { order: 4, instruction: 'Pour in the tomato purée, lentils, and 1.5 litres of water. Bring to a boil.' },
        { order: 5, instruction: 'Simmer for 20 minutes until lentils are soft.' },
        { order: 6, instruction: 'Add drained chickpeas and cook for 10 more minutes.' },
        { order: 7, instruction: 'Mix flour with a little cold water, stir into the soup to thicken. Simmer 5 minutes.' },
        { order: 8, instruction: 'Finish with lemon juice and fresh parsley. Serve with dates and chebakia.' },
      ],
      prepTime: 15,
      cookTime: 40,
      cuisine: 'Moroccan',
      diet: 'vegan',
      avgRating: 4.6,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    },
    {
      authorId: chef3._id,
      title: 'Moroccan Couscous with Seven Vegetables',
      description: 'The traditional Friday couscous loaded with seven colourful vegetables and a flavourful broth. A beloved staple of Moroccan family gatherings.',
      ingredients: [
        { name: 'Couscous', amount: '500', unit: 'g' },
        { name: 'Pumpkin', amount: '200', unit: 'g' },
        { name: 'Zucchini', amount: '2', unit: 'pieces' },
        { name: 'Carrots', amount: '3', unit: 'pieces' },
        { name: 'Turnip', amount: '1', unit: 'large' },
        { name: 'Cabbage', amount: '200', unit: 'g' },
        { name: 'Chickpeas', amount: '200', unit: 'g' },
        { name: 'Tomatoes', amount: '2', unit: 'pieces' },
        { name: 'Onion', amount: '2', unit: 'large' },
        { name: 'Ras el hanout', amount: '1', unit: 'tbsp' },
        { name: 'Butter', amount: '50', unit: 'g' },
      ],
      steps: [
        { order: 1, instruction: 'Steam the couscous twice, fluffing with butter and salt between steaming sessions.' },
        { order: 2, instruction: 'In a large pot, sauté onions in oil with ras el hanout until golden.' },
        { order: 3, instruction: 'Add all vegetables (except zucchini) and chickpeas with enough water to cover.' },
        { order: 4, instruction: 'Simmer for 25 minutes, then add zucchini and cook 10 more minutes.' },
        { order: 5, instruction: 'Pile the fluffy couscous in a large serving dish, make a well in the center.' },
        { order: 6, instruction: 'Arrange the vegetables over the couscous and pour broth over generously. Serve immediately.' },
      ],
      prepTime: 30,
      cookTime: 60,
      cuisine: 'Moroccan',
      diet: 'vegetarian',
      avgRating: 4.9,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    },
    {
      authorId: chef2._id,
      title: 'Spaghetti Carbonara',
      description: 'The authentic Roman carbonara — no cream, just eggs, Pecorino Romano, guanciale, and black pepper. Silky, rich, and done in 20 minutes.',
      ingredients: [
        { name: 'Spaghetti', amount: '400', unit: 'g' },
        { name: 'Guanciale (or pancetta)', amount: '150', unit: 'g' },
        { name: 'Egg yolks', amount: '4', unit: 'large' },
        { name: 'Whole egg', amount: '1', unit: 'piece' },
        { name: 'Pecorino Romano', amount: '80', unit: 'g' },
        { name: 'Black pepper', amount: '2', unit: 'tsp' },
        { name: 'Salt', amount: '1', unit: 'tbsp' },
      ],
      steps: [
        { order: 1, instruction: 'Cook spaghetti in well-salted boiling water until al dente. Reserve 1 cup pasta water.' },
        { order: 2, instruction: 'Dice guanciale and cook in a cold pan over medium heat until golden and crispy. Remove from heat.' },
        { order: 3, instruction: 'Whisk egg yolks, whole egg, and grated Pecorino Romano together. Season generously with black pepper.' },
        { order: 4, instruction: 'Drain pasta and immediately add to the pan with guanciale (heat off). Toss well.' },
        { order: 5, instruction: 'Add the egg mixture and a splash of pasta water. Toss vigorously — the residual heat cooks the eggs into a creamy sauce without scrambling.' },
        { order: 6, instruction: 'Add more pasta water if needed to reach a silky consistency. Serve immediately with extra Pecorino.' },
      ],
      prepTime: 5,
      cookTime: 20,
      cuisine: 'Italian',
      diet: 'none',
      avgRating: 4.7,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
    },
    {
      authorId: chef2._id,
      title: 'Margherita Pizza',
      description: 'The queen of pizzas — a thin Neapolitan base with San Marzano tomato sauce, fresh mozzarella, and basil. Simple perfection.',
      ingredients: [
        { name: 'Pizza flour (00)', amount: '500', unit: 'g' },
        { name: 'Active dry yeast', amount: '7', unit: 'g' },
        { name: 'San Marzano tomatoes', amount: '400', unit: 'g' },
        { name: 'Fresh mozzarella', amount: '250', unit: 'g' },
        { name: 'Fresh basil', amount: '1', unit: 'bunch' },
        { name: 'Olive oil', amount: '2', unit: 'tbsp' },
        { name: 'Salt', amount: '10', unit: 'g' },
        { name: 'Water', amount: '325', unit: 'ml' },
      ],
      steps: [
        { order: 1, instruction: 'Mix flour, yeast, salt, and water. Knead for 10 minutes until smooth. Rest for 2 hours until doubled.' },
        { order: 2, instruction: 'Crush San Marzano tomatoes by hand, season with salt and a drizzle of olive oil.' },
        { order: 3, instruction: 'Preheat oven to maximum temperature (250°C+) with a pizza stone or baking tray inside.' },
        { order: 4, instruction: 'Stretch the dough by hand into a thin 30cm circle on a floured surface.' },
        { order: 5, instruction: 'Spread tomato sauce evenly, leaving a 2cm border. Tear mozzarella and distribute over the top.' },
        { order: 6, instruction: 'Bake for 8-10 minutes until the crust is charred at the edges and cheese is bubbling.' },
        { order: 7, instruction: 'Top with fresh basil leaves and a final drizzle of olive oil. Serve immediately.' },
      ],
      prepTime: 120,
      cookTime: 10,
      cuisine: 'Italian',
      diet: 'vegetarian',
      avgRating: 4.5,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
    },
    {
      authorId: chef3._id,
      title: 'Avocado & Chickpea Buddha Bowl',
      description: 'A nourishing vegan bowl with roasted chickpeas, quinoa, fresh avocado, and a lemon-tahini dressing. Ready in 30 minutes.',
      ingredients: [
        { name: 'Quinoa', amount: '200', unit: 'g' },
        { name: 'Chickpeas (canned)', amount: '400', unit: 'g' },
        { name: 'Avocado', amount: '2', unit: 'ripe' },
        { name: 'Cherry tomatoes', amount: '150', unit: 'g' },
        { name: 'Baby spinach', amount: '100', unit: 'g' },
        { name: 'Tahini', amount: '3', unit: 'tbsp' },
        { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
        { name: 'Garlic', amount: '1', unit: 'clove' },
        { name: 'Smoked paprika', amount: '1', unit: 'tsp' },
        { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      ],
      steps: [
        { order: 1, instruction: 'Cook quinoa according to package instructions. Fluff and set aside.' },
        { order: 2, instruction: 'Drain and dry chickpeas, toss with olive oil, paprika, salt. Roast at 200°C for 25 minutes until crispy.' },
        { order: 3, instruction: 'Whisk tahini, lemon juice, minced garlic, and 3 tbsp water until smooth. Add water to desired consistency.' },
        { order: 4, instruction: 'Slice avocados and halve cherry tomatoes.' },
        { order: 5, instruction: 'Assemble bowls: quinoa base, spinach, roasted chickpeas, avocado, and tomatoes.' },
        { order: 6, instruction: 'Drizzle generously with tahini dressing. Sprinkle with sesame seeds if desired.' },
      ],
      prepTime: 10,
      cookTime: 25,
      cuisine: 'Mediterranean',
      diet: 'vegan',
      avgRating: 4.4,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    },
    {
      authorId: chef1._id,
      title: 'Msemen (Moroccan Flatbread)',
      description: 'Flaky, layered Moroccan flatbread made with semolina and flour. Perfect with honey and butter for breakfast or alongside tagine.',
      ingredients: [
        { name: 'All-purpose flour', amount: '300', unit: 'g' },
        { name: 'Fine semolina', amount: '150', unit: 'g' },
        { name: 'Salt', amount: '1', unit: 'tsp' },
        { name: 'Sugar', amount: '1', unit: 'tsp' },
        { name: 'Yeast', amount: '5', unit: 'g' },
        { name: 'Warm water', amount: '250', unit: 'ml' },
        { name: 'Vegetable oil', amount: '4', unit: 'tbsp' },
        { name: 'Butter', amount: '50', unit: 'g' },
      ],
      steps: [
        { order: 1, instruction: 'Mix flour, semolina, salt, sugar, yeast, and water. Knead for 10 minutes into a smooth dough. Rest 30 minutes.' },
        { order: 2, instruction: 'Divide into 8 equal balls. Oil your work surface and hands.' },
        { order: 3, instruction: 'Flatten each ball into a very thin rectangle using oiled hands.' },
        { order: 4, instruction: 'Spread softened butter and a pinch of semolina over the surface.' },
        { order: 5, instruction: 'Fold in thirds like a letter, then fold again to form a square. Rest 10 minutes.' },
        { order: 6, instruction: 'Flatten the squares gently and cook on a dry hot pan for 3-4 minutes per side until golden and flaky.' },
      ],
      prepTime: 40,
      cookTime: 30,
      cuisine: 'Moroccan',
      diet: 'vegetarian',
      avgRating: 4.7,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&h=600&fit=crop',
    },
    {
      authorId: chef3._id,
      title: 'Shakshuka',
      description: 'Eggs poached in a spiced tomato and pepper sauce. A North African and Middle Eastern classic that works for breakfast, lunch, or dinner.',
      ingredients: [
        { name: 'Eggs', amount: '4', unit: 'large' },
        { name: 'Canned tomatoes', amount: '400', unit: 'g' },
        { name: 'Red bell pepper', amount: '1', unit: 'large' },
        { name: 'Onion', amount: '1', unit: 'medium' },
        { name: 'Garlic', amount: '3', unit: 'cloves' },
        { name: 'Cumin', amount: '1', unit: 'tsp' },
        { name: 'Paprika', amount: '1', unit: 'tsp' },
        { name: 'Chili flakes', amount: '0.5', unit: 'tsp' },
        { name: 'Olive oil', amount: '2', unit: 'tbsp' },
        { name: 'Fresh parsley', amount: '1', unit: 'handful' },
      ],
      steps: [
        { order: 1, instruction: 'Sauté diced onion and sliced pepper in olive oil over medium heat for 8 minutes.' },
        { order: 2, instruction: 'Add minced garlic, cumin, paprika, and chili flakes. Cook for 1 minute until fragrant.' },
        { order: 3, instruction: 'Pour in crushed tomatoes, season with salt. Simmer for 15 minutes until thickened.' },
        { order: 4, instruction: 'Make 4 wells in the sauce with a spoon. Crack an egg into each well.' },
        { order: 5, instruction: 'Cover and cook for 5-7 minutes until egg whites are set but yolks are still runny.' },
        { order: 6, instruction: 'Sprinkle with fresh parsley and serve directly from the pan with crusty bread.' },
      ],
      prepTime: 10,
      cookTime: 25,
      cuisine: 'Mediterranean',
      diet: 'vegetarian',
      avgRating: 4.6,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&h=600&fit=crop',
    },
  ]);

  // Add one review per recipe to make ratings show correctly
  const reviewData = recipes.map((recipe, i) => ({
    recipeId: recipe._id,
    userId: [chef1._id, chef2._id, chef3._id][i % 3],
    rating: recipe.avgRating,
    comment: [
      'Absolutely delicious! Made it for the whole family.',
      'Perfect recipe, turned out amazing on the first try!',
      'So flavourful and easy to follow. Will make again.',
    ][i % 3],
  }));

  await Review.insertMany(reviewData);

  console.log(`Seeded ${recipes.length} recipes and 3 users.`);
  console.log('Login with: fatima@example.com / marco@example.com / amina@example.com');
  console.log('Password for all: password123');
  await mongoose.disconnect();
};

run().catch((err) => { console.error(err); process.exit(1); });
