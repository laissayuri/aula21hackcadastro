const express = require("express");
const bodyParser = require('body-parser');
const mongo = require("express-mongo-db");
const cors = require("cors");

const app = express();

app.use(cors()); //aplicação pode ser acessada de qualquer lugar
app.use(bodyParser.json()); //garante que tudo que entra e sai dessa aplicação é JSON
app.use(mongo("mongodb://localhost/cadastro"));



//[objetivo] | [método] | [endereço] | [parametros] | [resposta]
// Obter Usuários | GET | /usuarios | nao | lista de nomes
app.get("/usuarios", (req, res) => {
    req.db.collection("usuarios").find().toArray((erro, dados) => {
        if(!erro){
            return res.send({usuarios: dados}); // oq for escrito aqui é escrito em json
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"});
    });
});

// Obter 1 Usuário | GET | /usuario | nome | todos os dados do usuario
app.get("/usuario/:nome", (req, res) => {
    req.db.collection("usuarios").findOne({nome:req.params.nome}, (erro, dados) => {
        if (!erro){
            if(!dados){ //se nao tiver dados (ta vazio)
                return res.send({}); //cria-se um objeo vazio
            }
            return res.send(dados);
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"});
    });
});

// Cadastrar usuarios | POST | /usuario/novo | todos os dados | true/false
app.post("/usuario/novo", (req, res) => {
    if (!req.body.nome || !req.body.email || !req.body.senha){ //se nao tiver o nome, o email ou a senha
        return res.status(400).send({erro: "Parâmetros obrigatórios ausentes"});
    }

    req.db.collection("usuarios").insert(req.body, erro =>{
        if(!erro){
            return res.send({mensagem: "Usuário Cadastrado"});
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"});
    });
});

// Remover Usuário | DELETE | /usuario/remover | nome | true/false;
app.delete("usuario/remover/:nome", (req, res) => {
    req.db.collection("usuarios").remove({nome: req.params.nome}, erro => {
        if(!erro){
            return res.send({mensagem: "Usuário Removido"});
        }
        return res.status(500).send({erro: "Problema ao consultar o banco de dados"});
    })
});

app.listen(5000, () => {
    console.log("Serviço de Cadastro Inicializado");
});