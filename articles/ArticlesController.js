const express = require('express');
const router = express.Router();
const slugify = require('slugify');

const Article = require('./Article');
const Category = require('../categories/Category');

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render('admin/articles/index', { articles });
  });
});

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then((categories) => {
    res.render('admin/articles/new', { categories });
  });
});

router.get('/admin/articles/edit/:id', (req, res) => {
  const { id } = req.params;

  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('admin/articles/edit', { article, categories });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => res.redirect('/'));
});

router.get('/articles/:page', (req, res) => {
  const { page } = req.params;
  var offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset,
    order: [['id', 'DESC']],
  }).then((articles) => {
    var next;

    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    var result = {
      page: parseInt(page),
      articles,
      next,
    };

    Category.findAll().then((categories) => {
      res.render('admin/articles/page', { categories, result });
    });
  });
});

router.post('/articles/save', (req, res) => {
  const { title, body, categorieId } = req.body;

  Article.create({
    categorieId,
    title,
    slug: slugify(title),
    body,
  }).then(() => res.redirect('/admin/articles'));
});

router.post('/articles/update', (req, res) => {
  const { id, title, body, categorieId } = req.body;

  Article.update(
    {
      title,
      body,
      slug: slugify(title),
      categorieId,
    },
    {
      where: { id },
    }
  )
    .then(() => res.redirect('/admin/articles'))
    .catch((err) => res.redirect('/'));
});

router.post('/articles/delete', (req, res) => {
  const { id } = req.body;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({ where: { id } }).then(() =>
        res.redirect('/admin/articles')
      );
    } else {
      res.redirect('/admin/articles');
    }
  } else {
    res.redirect('/admin/articles');
  }
});

module.exports = router;
