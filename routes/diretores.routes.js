const express = require('express');
const router = express.Router();
const { Diretor, Filme } = require('../models/relacionamentosModels');

router.get('/', async (req, res) => {
  const diretores = await Diretor.findAll({ raw: true });
  res.render('diretores/listar', { diretores });
});

router.get('/cadastrar', (req, res) => res.render('diretores/cadastrar'));

router.post('/', async (req, res) => {
  const { nome, anoNascimento, nacionalidade } = req.body;
  await Diretor.create({ nome, anoNascimento, nacionalidade });
  res.redirect('/diretores');
});

router.get('/:id', async (req, res) => {
  const diretor = await Diretor.findByPk(req.params.id, {
    include: [{ model: Filme, as: 'filmes' }]
  });
  res.render('diretores/detalhar', { diretor: diretor.toJSON() });
});

router.get('/:id/editar', async (req, res) => {
  const diretor = await Diretor.findByPk(req.params.id, { raw: true });
  res.render('diretores/editar', { diretor });
});

router.put('/:id', async (req, res) => {
  const diretor = await Diretor.findByPk(req.params.id);
  await diretor.update({
    nome: req.body.nome,
    anoNascimento: req.body.anoNascimento,
    nacionalidade: req.body.nacionalidade
  });
  res.redirect('/diretores/' + req.params.id);
});

router.delete('/:id', async (req, res) => {
  const diretor = await Diretor.findByPk(req.params.id);
  await diretor.destroy();
  res.redirect('/diretores');
});

module.exports = router;