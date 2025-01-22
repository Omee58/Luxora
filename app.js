const express = require('express');
const app = express();
const path = require('path');
const sellers = require('./routers/sellersRoute');
const forgotPassword = require('./routers/updatePasswordRoute');
require('dotenv').config();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index'); 
});

app.use('/sellers', sellers);
app.use('/updatePassword', forgotPassword);

app.get('/customer', (req, res) => {
  res.send('You are in Customer Page, i will create it Soon ...');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  res.cookie('token', '');
  res.redirect('/');
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