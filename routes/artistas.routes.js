const express = require('express');
const router = express.Router();
const { Artista, Filme } = require('../models/relacionamentosModels');

router.get('/', async (req, res) => {
  const artistas = await Artista.findAll({ raw: true });
  res.render('artistas/listar', { artistas });
});

router.get('/cadastrar', (req, res) => res.render('artistas/cadastrar'));

router.post('/', async (req, res) => {
  const { nome, anoNascimento, foto, nomeArtistico } = req.body;
  await Artista.create({
    nome, anoNascimento, foto, nomeArtistico,
    emAtividade: req.body.emAtividade === 'on' 
  });
  res.redirect('/artistas');
});

router.get('/:id', async (req, res) => {
  const artista = await Artista.findByPk(req.params.id, {
    include: [{ model: Filme, as: 'filmes' }]
  });
  res.render('artistas/detalhar', { artista: artista.toJSON() });
});


router.get('/:id/editar', async (req, res) => {
  const artista = await Artista.findByPk(req.params.id, { raw: true });
  res.render('artistas/editar', { artista });
});


router.put('/:id', async (req, res) => {
  const artista = await Artista.findByPk(req.params.id);
  await artista.update({
    nome: req.body.nome,
    nomeArtistico: req.body.nomeArtistico,
    anoNascimento: req.body.anoNascimento,
    foto: req.body.foto,
    emAtividade: req.body.emAtividade === 'on'
  });
  res.redirect('/artistas/' + req.params.id);
});


router.delete('/:id', async (req, res) => {
  const artista = await Artista.findByPk(req.params.id);
  await artista.destroy();
  res.redirect('/artistas');
});

module.exports = router;