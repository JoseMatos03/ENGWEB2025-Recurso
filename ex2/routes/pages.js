const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /
router.get('/', async (req, res) => {
  try {
    const resp = await axios.get('http://localhost:18000/cocktails');
    const cocktails = resp.data;

    const creatorsMap = {};
    cocktails.forEach(c => {
      if (c.criador && c.criador.id) {
        creatorsMap[c.criador.id] = c.criador.nome;
      }
    });

    res.render('index', {
      title: 'Catálogo de Cocktails',
      cocktails,
      creatorsMap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar página principal');
  }
});

// GET /cocktails/:id
router.get('/cocktails/:id', async (req, res) => {
  try {
    const resp = await axios.get(`http://localhost:18000/cocktails/${req.params.id}`);
    const cocktail = resp.data;
    res.render('cocktail', {
      title: cocktail.nome,
      cocktail
    });
  } catch (err) {
    console.error(err);
    res.status(404).send('Cocktail não encontrado');
  }
});

// GET /criadores/:id
router.get('/criadores/:id', async (req, res) => {
  try {
    const resp = await axios.get('http://localhost:18000/criadores');
    const allCreators = resp.data;
    const creatorEntry = allCreators.find(c => c.criador.id === req.params.id);
    if (!creatorEntry) return res.status(404).send('Criador não encontrado');

    const cocktailsDetails = await Promise.all(
      creatorEntry.cocktails.map(item =>
        axios.get(`http://localhost:18000/cocktails/${item.id}`).then(r => r.data)
      )
    );

    res.render('creator', {
      creator: creatorEntry.criador,
      cocktails: cocktailsDetails
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar página do criador');
  }
});

module.exports = router;