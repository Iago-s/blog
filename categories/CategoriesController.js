const express = require('express');
const router = express.Router();
const slugify = require('slugify');

const adminAuth = require('../middleware/adminAuth');

const Category = require('./Category');

router.get('/admin/categories', adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render('admin/categories/index', { categories });
  });
});

router.get('/admin/categories/new', adminAuth, (req, res) => {
  res.render('admin/categories/new');
});

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect('/admin/categories');
    return;
  }

  Category.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render('admin/categories/edit', { category });
      } else {
        res.redirect('/admin/categories');
      }
    })
    .catch((err) => res.redirect('/admin/categories'));
});

router.post('/categories/save', (req, res) => {
  const { title } = req.body;

  if (title != undefined) {
    Category.create({
      title,
      slug: slugify(title),
    }).then(() => res.redirect('/admin/categories'));
  } else {
    res.redirect('/admin/categories/new');
  }
});

router.post('/categories/update', (req, res) => {
  const { id, title } = req.body;

  Category.update(
    { title, slug: slugify(title) },
    {
      where: { id },
    }
  ).then(() => res.redirect('/admin/categories'));
});

router.post('/categories/delete', (req, res) => {
  const { id } = req.body;

  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({ where: { id } }).then(() =>
        res.redirect('/admin/categories')
      );
    } else {
      res.redirect('/admin/categories');
    }
  } else {
    res.redirect('/admin/categories');
  }
});

module.exports = router;
