const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('express-mongo-db');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(mongo('mongodb://localhost/cadastro'));

// - Obter os usuários | GET | /usuarios | não | lista de nomes.
app.get('/usuarios', (req, res) => {
    req.db.collection('usuarios').find().toArray((erro, dados) => {
        if(!erro){
            return res.send({usuarios: dados});
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"});
    });
});

// - Obter um usuário | GET | /usuario | nome | todos os dados do usuario

app.get('/usuario/:nome', (req, res) => {
    req.db.collection('usuarios').findOne({nome: req.params.nome}, (erro, dados) => {
        if(!erro){
            if(!dados){
                return res.send({});
            }
            return res.send(dados);
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"})
    })
});

// - Cadastrar usuario | POST | /usuario/novo | todos os dados do usuario | true/false
app.post('/usuario/novo', (req, res) => {
    if(!req.body.nome || !req.body.email || !req.body.senha){
        return res.status(400).send({erro: "Parâmetros obrigatórios ausentes"});
    }

    req.db.collection('usuarios').insert(req.body, erro => {
        if(!erro){
            return res.send({mensagem: "Usuário cadastrado"});
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"});
    }); 
});

// - Remover usuario | DELETE | /usuario/remover | nome | true/false
app.delete('/usuario/remover/:nome', (req, res) => {
    req.db.collection('usuarios').remove({nome: req.params.nome}, erro => {
        if(!erro){
            return res.send({mensagem: "Usuário removido"});
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"});
    });
});

app.post('/usuario/login', (req, res) => {
    req.db.collection('usuarios').findOne({
        nome: req.body.nome
    }, (erro, dados) => {
        if(!erro){
            if(!dados){
                return res.send({login: false});
            }
            if(req.body.senha === dados.senha){
                return res.send({login: true});
            }
            return res.send({login: false});
        }
        return res.status(500).send({erro: "Sei la, não encontrado."});
    });
});

app.listen(5000, ()=>{
    console.log("Serviço de cadastro está sendo executado");
});