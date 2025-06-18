const express = require('express');
const path = require('path');
const pagesRouter = require('./routes/pages');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pagesRouter);

const PORT = 18001;
app.listen(PORT, () => console.log(`Web app na porta ${PORT}`));
