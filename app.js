const express = require('express');
const app = express();
const path = require('path');
const sellers = require('./routers/sellersRoute');
const port = 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index'); 
});

app.use('/sellers', sellers);

app.get('/customer', (req, res) => {
  res.send('You are in Customer Page, i will create it Soon ...');
});

app.get('/owner', (req, res) => {
  res.send('You are in Owner Page, i will create it Soon ...');
});

app.get('*', (req, res) => {
  res.render('404page'); 
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});