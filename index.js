const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

const categoriesController = require('./categories/CategoriesController');
const Category = require('./categories/Category');

const articlesController = require('./articles/ArticlesController');
const Article = require('./articles/Article');

const connection = require('./database/database');
connection
  .authenticate()
  .then(() => console.log('Database connection success!'))
  .catch((err) => console.log('Failed to connect to database!'));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', categoriesController);
app.use('/', articlesController);

app.listen(PORT, () => {
  console.log(`Serve started in http://localhost:${PORT}`);
});
