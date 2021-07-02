const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
  res.send('Categories router');
});

router.get('/admin/categories/new', (req, res) => {
  res.send('Categories router new');
});

module.exports = router;
