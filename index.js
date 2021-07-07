const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

const usersController = require('./users/UsersController');
const Users = require('./users/Users');

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

app.use('/', usersController);
app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    limit: 8,
  }).then((articles) => {
    Category.findAll().then((categories) =>
      res.render('index', { articles, categories })
    );
  });
});

app.get('/:slug', (req, res) => {
  const { slug } = req.params;

  Article.findOne({
    where: { slug },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) =>
          res.render('article', { article, categories })
        );
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => res.redirect('/'));
});

app.get('/category/:slug', (req, res) => {
  const { slug } = req.params;

  Category.findOne({
    where: { slug },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render('index', { articles: category.articles, categories });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => res.redirect('/'));
});

app.listen(PORT, () => {
  console.log(`Serve started in http://localhost:${PORT}`);
});
