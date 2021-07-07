const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const Users = require('./Users');

router.get('/admin/users', (req, res) => {
  Users.findAll().then((users) => {
    res.render('admin/users/index', { users });
  });
});

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create');
});

router.get('/admin/users/edit/:id', (req, res) => {
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

module.exports = router;
