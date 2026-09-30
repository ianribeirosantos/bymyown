const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const sequelize = require('./config/bd');
require('./models/relacionamentosModels'); 

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => res.render('home', { titulo: 'Sistema de Filmes' }));


app.use('/filmes', require('./routes/filmes.routes'));
app.use('/artistas', require('./routes/artistas.routes'));
app.use('/diretores', require('./routes/diretores.routes'));
app.use('/fichas', require('./routes/fichas.routes'));

async function conectarBD() {
  try {
    await sequelize.sync();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}
conectarBD();

app.listen(3000, () => console.log('Servidor em http://localhost:3000'));