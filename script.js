let botoes = document.querySelectorAll("button");

//Cadastrar
botoes[0].onclick = function(){
    let inputs = document.querySelectorAll("#novo input");
    for (let input of inputs){
        if(!input.value.trim()){
            return alert("Preencha todos os campos");
        }
    }

    fetch(`http://localhost:5000/usuario/${inputs[0].value.trim()}`, {

    }).then( resposta =>{
        return resposta.json();
    }).then(dados =>{
        if(dados.nome){
            alert("Usuário já existe");
        } else {
            let novoUsuario = {
                nome: inputs[0].value.trim(),
                senha: inputs[1].value.trim(),
                email: inputs[2].value.trim()
            }
        
            fetch("http://localhost:5000/usuario/novo", {
                method: "POST",
                body:JSON.stringify(novoUsuario),
                headers:{
                    "Content-Type":"application/json"
                }
        
            }).then(resposta => {
                return resposta.json();
            }).then(dados => {
                alert("SUCESSO");
                alert(dados.mensagem);
                preencher();
            }).catch(erro => {
                alert("Erro ao Cadastrar");
                alert(erro.erro);
            });
        }
    }).catch(erro =>{
        alert("Erro ao Cadastrar");
        alert(erro);
    });
}


function preencher(){
    let lista = document.querySelector("#listadeusuarios");
    fetch("http://localhost:5000.usuarios").then(resposta => {
        return resposta.json();
    }).then(dados => {
        lista.innerHTML = JSON.stringify(dados);
    }).catch( erro => {
        alert("Erro ao Cadastrar");
        alert(erro);
    });
}


//Apagar
botoes[1].onclick = function(){
    let input = document.querySelector("#apagar input");
    if(!input.value.trim()){
        return alert("Preencha o nome do usuário");
    }

    fetch(`http://localhost:5000/usuario/remover/${input.value.trim()}`,{
        method: "DELETE"
    }).then(resposta => {
        return resposta.json();
    }).then(dados => {
        console.log(dados.mensagem);
        preencher();
    }).catch(erro => {
        alert("Erro ao apagar o usário");
        alert(erro);
    });
}
