const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const adminAuth = require('../middleware/adminAuth');

const Users = require('./Users');

router.get('/admin/users', adminAuth, (req, res) => {
  Users.findAll().then((users) => {
    res.render('admin/users/index', { users });
  });
});

router.get('/admin/users/create', adminAuth, (req, res) => {
  res.render('admin/users/create');
});

router.get('/admin/users/edit/:id', adminAuth, (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect('/admin/users');
    return;
  }

  Users.findByPk(id)
    .then((user) => {
      if (user != undefined) {
        res.render('admin/users/edit', { user });
      } else {
        res.redirect('/admin/users');
      }
    })
    .catch((err) => res.redirect('/admin/users'));
});

router.post('/users/create', (req, res) => {
  const { email, password } = req.body;

  Users.findOne({
    where: { email },
  }).then((user) => {
    if (user == undefined) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      Users.create({
        email,
        password: hash,
      })
        .then(() => res.redirect('/admin/users'))
        .catch((err) => res.redirect('/'));
    } else {
      res.redirect('/admin/users/create');
    }
  });
});

router.post('/users/update', (req, res) => {
  const { id, email } = req.body;

  Users.findByPk(id).then((user) => {
    if (user != undefined) {
      Users.update(
        { email, password: user.password },
        {
          where: { id },
        }
      ).then(() => res.redirect('/admin/users'));
    } else {
      res.redirect('/');
    }
  });
});

router.post('/users/delete', (req, res) => {
  const { id } = req.body;

  if (id != undefined) {
    if (!isNaN(id)) {
      Users.destroy({ where: { id } }).then(() => res.redirect('/admin/users'));
    } else {
      res.redirect('/admin/users');
    }
  } else {
    res.redirect('/admin/users');
  }
});

router.get('/login', (req, res) => {
  res.render('admin/users/login');
});

router.post('/auth', (req, res) => {
  const { email, password } = req.body;

  Users.findOne({
    where: {
      email,
    },
  }).then((user) => {
    if (user != undefined) {
      const correct = bcrypt.compareSync(password, user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };

        res.redirect('/admin/categories');
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;

  res.redirect('/');
});

module.exports = router;
