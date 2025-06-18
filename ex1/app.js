const express = require('express');
const mongoose = require('mongoose');
const cocktailsRouter = require('./routes/cocktails');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cocktails', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/', cocktailsRouter);

const PORT = 18000;
app.listen(PORT, () => {
    console.log(`API Eurovisão a correr na porta ${PORT}`);
});
