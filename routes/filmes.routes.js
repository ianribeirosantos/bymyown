const express = require('express');
const router = express.Router();
const { Filme, Diretor, Artista, FichaTecnica } = require('../models/relacionamentosModels');


router.get('/', async (req, res) => {
  const filmes = await Filme.findAll({
    include: [{ model: Diretor, as: 'diretor' }],
    raw: true, nest: true
  });
  res.render('filmes/listar', { filmes });
});

router.get('/cadastrar', async (req, res) => {
  const diretores = await Diretor.findAll({ raw: true });
  const artistas = await Artista.findAll({ raw: true });
  res.render('filmes/cadastrar', { diretores, artistas });
});

router.post('/', async (req, res) => {
  const { nome, ano, diretorId, artistasIds } = req.body;
  const filme = await Filme.create({ nome, ano, diretorId: diretorId || null });
  if (artistasIds) await filme.setArtistas([].concat(artistasIds)); 
  res.redirect('/filmes');
});

// DETALHAR
router.get('/:id', async (req, res) => {
  const filme = await Filme.findByPk(req.params.id, {
    include: [
      { model: Diretor, as: 'diretor' },
      { model: FichaTecnica, as: 'fichaTecnica' },
      { model: Artista, as: 'artistas' }
    ]
  });

  res.render('filmes/detalhar', { filme: filme.toJSON() });
});


router.get('/:id/editar', async (req, res) => {
  const filme = await Filme.findByPk(req.params.id, { raw: true });
  res.render('filmes/editar', { filme });
});

router.put('/:id', async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);
  filme.nome = req.body.nome;
  filme.ano = req.body.ano;
  await filme.save();
  res.redirect('/filmes');
});

router.delete('/:id', async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);
  await filme.destroy();
  res.redirect('/filmes');
});

module.exports = router;