const express = require('express');
const router = express.Router();
const Cocktail = require('../models/cocktail');

// GET /cocktails
// lista todos (id, nome, categoria, criador)
router.get('/cocktails', async (req, res) => {
  try {
    const { ingrediente } = req.query;
    if (ingrediente) {
      // /cocktails?ingrediente=EEEE
      const list = await Cocktail
        .find({ ingredientes: { $regex: ingrediente, $options: 'i' } })
        .select('_id nome ingredientes');
      return res.json(list);
    }
    // sem filtro
    const list = await Cocktail
      .find()
      .select('_id nome categoria criador');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter cocktails' });
  }
});

// GET /cocktails/:id
// devolve todos os campos do cocktail
router.get('/cocktails/:id', async (req, res) => {
  try {
    const c = await Cocktail.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Cocktail não encontrado' });
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter cocktail' });
  }
});

// GET /criadores
// lista únicos criadores, com a lista de cocktails que criaram
router.get('/criadores', async (req, res) => {
  try {
    const agg = await Cocktail.aggregate([
      { $match: { criador: { $exists: true } } },
      { $group: {
          _id: { id: '$criador.id', nome: '$criador.nome' },
          cocktails: { $push: { id: '$_id', nome: '$nome' } }
      }},
      { $project: {
          _id: 0,
          criador: '$_id',
          cocktails: 1
      }},
      { $sort: { 'criador.nome': 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter criadores' });
  }
});

// GET /ingredientes
// lista únicos ingredientes, com a lista de cocktails onde aparecem
router.get('/ingredientes', async (req, res) => {
  try {
    const agg = await Cocktail.aggregate([
      { $unwind: '$ingredientes' },
      { $group: {
          _id: '$ingredientes',
          cocktails: { $push: { id: '$_id', nome: '$nome' } }
      }},
      { $project: {
          _id: 0,
          ingrediente: '$_id',
          cocktails: 1
      }},
      { $sort: { ingrediente: 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter ingredientes' });
  }
});

// GET /categorias
// lista únicas categorias, com a lista de cocktails em cada categoria
router.get('/categorias', async (req, res) => {
  try {
    const agg = await Cocktail.aggregate([
      { $match: { categoria: { $exists: true, $ne: '' } } },
      { $group: {
          _id: '$categoria',
          cocktails: { $push: { id: '$_id', nome: '$nome' } }
      }},
      { $project: {
          _id: 0,
          categoria: '$_id',
          cocktails: 1
      }},
      { $sort: { categoria: 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter categorias' });
  }
});

// POST /cocktails
// criar novo cocktail
router.post('/cocktails', async (req, res) => {
  try {
    const novo = new Cocktail(req.body);
    const saved = await novo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Dados inválidos', error: err });
  }
});

// DELETE /cocktails/:id
// eliminar cocktail
router.delete('/cocktails/:id', async (req, res) => {
  try {
    const removed = await Cocktail.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Cocktail não encontrado' });
    res.json({ message: 'Cocktail eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao eliminar cocktail' });
  }
});

// PUT /cocktails/:id
// atualizar cocktail
router.put('/cocktails/:id', async (req, res) => {
  try {
    const updated = await Cocktail.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Cocktail não encontrado' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erro ao atualizar cocktail', error: err });
  }
});

module.exports = router;
