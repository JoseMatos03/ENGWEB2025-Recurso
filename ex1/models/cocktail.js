const mongoose = require('mongoose');

const criadorSchema = new mongoose.Schema({
  id:   { type: String, required: true },
  nome: { type: String, required: true }
}, { _id: false });

const cocktailSchema = new mongoose.Schema({
  _id:         { type: String, required: true },    // vem do campo "id" do JSON
  nome:        { type: String, required: true },
  foto:        { type: String },                    // URL da imagem (opcional)
  categoria:   { type: String },                    // e.g. "cocktail", "shot", etc. (opcional)
  servidoEm:   { type: String },                    // e.g. "coupe", "highballglass" (opcional)
  preparacao:  { type: String },
  ingredientes:{ type: [String], required: true },
  criador:     { type: criadorSchema }              // opcional
}, {
  collection: 'cocktails',
  timestamps: true
});

module.exports = mongoose.model('Cocktail', cocktailSchema);
