const express = require('express'); //require é utilizado quando queremos importar/trazr um modulo externo pra dentro do arquivo, nesse caso, é o express, que cuida do servidor e das rotas
const exphbs = require('express-handlebars');//mesma coisa em relaçção ao require, mas nesse caso é o express-handlebars, que cuida da renderização das páginas, ele permite que vejamos os dados no navegador, e não apenas no console
const sequelize = require('./config/bd'); //conexão com o arquivo bd que é o banco de dados
const Filme = require('./models/filme.model');//importanto o model filme, que é o que vai permitir a criação de filmes no banco de dados 
const methodOverride = require('method-override'); //importa o method-override, que é um middleware que permite que o express interprete métodos HTTP diferentes do GET e POST, como PUT e DELETE, que são utilizados para atualizar e deletar dados no banco de dados, respectivamente. ele funciona como um tradutor, ou seja, ele traduz os métodos HTTP para o express entender.
const app = express();//permite que usemos o express que importamos anteriormente

require('./models/relacionamentosModels');

// Middleware para formulário---> middleware funciona como um tradutor

app.use(methodOverride('_method')); //ativa o method-override para interpretar métodos HTTP diferentes

app.use(express.urlencoded({ extended: true }));
//url encoded permite que o express interprete os dados que vieram através do formulário; 
//já o extend:true diz como o express vai interpretar os dados, ela permite objetos complexos, já o false só simples, como strings e arrays.
app.use(express.json());//interpreta os dados que vieram através do formulário, mas nesse caso, ele interpreta os dados em formato JSON, que é um formato de dados muito utilizado na web

//se os dois são para interpretar os dados que vieram através do formulário, qual a diferença entre eles? A diferença é que o urlencoded é utilizado quando o formulário é enviado através do método POST, no html, já o json é utilizado quando o formulário é enviado através do método GET, ou seja, quando os dados são enviados na URL.


// Configurando Handlebars
app.engine('handlebars', exphbs.engine({defaultLayout: false})); //diz o seguinte: "Quando eu usar a engine handlebars, use o Express Handlebars para processar os arquivos." 
//O termo engine aqui significa motor, ou seja, o motor que vai processar os arquivos. 
// O defaultLayout: false significa que não vamos utilizar um layout padrão, ou seja, cada página vai ter seu próprio layout, é comum termos um layout padrão, mas nesse caso, não vamos utilizar, pois cada página vai ter seu próprio layout, e não vamos utilizar um layout padrão.

app.set('view engine', 'handlebars'); //diz o seguinte: "Quando eu renderizar uma página, utilize a engine handlebars para processar os arquivos."

// Rota GET - Página inicial
app.get('/', (req, res) => { //"quando alguem fizer uma requisição get pro '/', execute essa função:" 
//o que é req e res que sempre estão juntos? bom, req é oq o usuário pediu, e o res e a forma como o servidor vai responder de volta ao user, ou seja, o req é o que o usuário pediu, e o res é a resposta do servidor para o usuário.
  res.render('home', {
    titulo: 'Página Inicial'
  }); //o .render é uma função do express para a resposta que irá ser dada ao user, ele vai renderizar a página home, ou seja, vai buscar o arquivo/template home.handlebars e vai mostrar ela , colocando o titulo de pagina incial para o user ver ela através da parte {{titulo}} (que é o nome que escolhemos) presente no template home. é como se dissesse: "Abra home.handlebars e passe para ele uma variável chamada titulo com o valor Página Inicial."

});

// Rota GET - Listar filmes
app.get('/filmes', async (req, res) => { //igual, mas nesse caso a rota é /filmes
//async serve para dizer que trabalharemos com funções assíncronas, ou seja, funções que podem demorar para serem executadas, como por exemplo, uma requisição para o banco de dados, que pode demorar alguns milissegundos para retornar a resposta. nesse tempo, temos uma promisse, que é uma promessa de que a função vai retornar uma resposta, e enquanto isso, o servidor não fica parado, ele continua executando outras funções, e quando a função assíncrona terminar de executar, ela vai retornar a resposta para o servidor, que vai continuar executando as funções que estavam esperando a resposta da função assíncrona.
  const filmes = await Filme.findAll({raw: true}); //await serve para dizer que vamos esperar a resposta da função assíncrona, ou seja, vamos esperar a resposta do banco de dados
//o filme.findAll é tipo select * from filmes
//await espera a consulta terminar
//raw:true serve pra dizer que queremos apenas o 'cru', sem informações adicionais automaticas dele, tipo CreatedAt, só o que nós decidimos mesmo
  res.render('filmes', { filmes }); //o {filmes} é uma forma de passar a variável filmes para o template filmes. é uma abreviação da forma que fizemos anteriormente, mas não mudaremos o nome igual lá, entao será filmes: filmes, ou seja, a variável filmes que está sendo passada para o template filmes, vai se chamar filmes no template também. é como se disséssemos: "Abra filmes.handlebars e passe para ele uma variável chamada filmes com o valor da variável filmes que está aqui no app.js."
}); 

// Rota GET - Formulário de cadastro
app.get(
  '/filmes/cadastrar', 
  (req, res) =>  res.render('cadastrarFilme')
); //renderiza/mostra o cadastrarFilme.handlebars, que é o template do formulário de cadastro de filmes, e não precisa passar nenhuma variável para ele, pois ele não precisa de nenhuma variável para ser renderizado, ele só precisa ser mostrado para o user.

app.get(
    '/filmes/:id/editar',
    async (req, res) => {
        const id = req.params.id; //params serve para pegar o id que está na URL, ou seja, o id do filme que o user quer editar
        const filme = await Filme.findByPk(id, {raw:true});
        res.render('editarFilme', { filme}); //findByPk diz que buscaremos o filme pelo id (1, 2, 3...)
    }

)
app.put( //o .put serve pra atualizar os dados do filme, ou seja, ele vai pegar o id do filme que o user quer atualizar, e vai atualizar os dados do filme no banco de dados.
  '/filmes/:id', 
  async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const ano = req.body.ano;
    
    const filme = await Filme.findByPk(id);
    
    filme.nome = nome;
    filme.ano = ano;
    await filme.save();

    res.redirect('/filmes');
  }
);
app.delete(
  '/filmes/:id', 
  async (req, res) => {
    const id = req.params.id;
    const filme = await Filme.findByPk(id);
    await filme.destroy();
    res.redirect('/filmes');
  }
);
// Rota POST - Cadastrar filme
app.post('/filmes', async (req, res) => {

  const nome = req.body.nome; //pegamos o campo nome da tabela do formulario, onde o user difgitiou o nome do filme, então requisitamos. o body 
  const ano = req.body.ano;

  await Filme.create({ //tipo insert into filmes (nome, ano) values (nome, ano)
    nome: nome, 
    ano: ano
  });

  res.redirect('/filmes'); //quando cadastrado, redirecia o user para /filmes que lista todos os filmes 
});

async function conectarBD() {
  try { //try é usado quando há possibilidade de erro
    await sequelize.sync();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {// se der errado no try, ele vai cair no catch, que é usado para tratar o erro, ou seja, mostrar uma mensagem de erro para o user, e não deixar o servidor travar.
    console.error('Erro ao conectar:', erro); //console.log é usado para mostrar mensagens no console, já o console.error é usado para mostrar mensagens de erro no console
  }
}

conectarBD(); //acima nos criamos a função e aquiu usamos ela

// Inicializando servidor
app.listen(3000, () => {

  console.log('Servidor executando em http://localhost:3000');

});