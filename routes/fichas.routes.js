const express = require('express');
const router = express.Router();
const { FichaTecnica, Filme } = require('../models/relacionamentosModels');

router.get('/', async (req, res) => {
  const fichas = await FichaTecnica.findAll({
    include: [{ model: Filme, as: 'filme' }],
    raw: true, nest: true
  });
  res.render('fichas/listar', { fichas });
});

router.get('/cadastrar', async (req, res) => {
  const filmes = await Filme.findAll({ raw: true });
  res.render('fichas/cadastrar', { filmes });
});

router.post('/', async (req, res) => {
  const { filmeId, duracaoMinutos, orcamento, bilheteria } = req.body;
  await FichaTecnica.create({ filmeId, duracaoMinutos, orcamento, bilheteria });
  res.redirect('/fichas');
});

router.get('/:id', async (req, res) => {
  const ficha = await FichaTecnica.findByPk(req.params.id, {
    include: [{ model: Filme, as: 'filme' }]
  });
  res.render('fichas/detalhar', { ficha: ficha.toJSON() });
});

router.get('/:id/editar', async (req, res) => {
  const ficha = await FichaTecnica.findByPk(req.params.id, {
    include: [{ model: Filme, as: 'filme' }]
  });
  res.render('fichas/editar', { ficha: ficha.toJSON() });
});

router.put('/:id', async (req, res) => {
  const ficha = await FichaTecnica.findByPk(req.params.id);
  await ficha.update({
    duracaoMinutos: req.body.duracaoMinutos,
    orcamento: req.body.orcamento,
    bilheteria: req.body.bilheteria
  });
  res.redirect('/fichas/' + req.params.id);
});

router.delete('/:id', async (req, res) => {
  const ficha = await FichaTecnica.findByPk(req.params.id);
  await ficha.destroy();
  res.redirect('/fichas');
});

module.exports = router;