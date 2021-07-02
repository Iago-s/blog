const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

const connection = require('./database/database');
connection
  .authenticate()
  .then(() => console.log('Connect with database success!'))
  .catch((err) => console.log('Failed connect with database!'));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Serve started in http://localhost:${PORT}`);
});
