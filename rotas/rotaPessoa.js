var Pessoa = require('../modelo/pessoa');
var Ambiente = require('../modelo/ambiente');

var express = require('express');
var router = express.Router();

/**
 * @api {get} /
 * @apiGroup Pessoa
 *
 * @apiSuccess {Pessoa[]} dados Todas as pessoas cadastradas na aplicação.
 *
 * @apiSuccessExample {json} Sucesso
 *    HTTP/1.1 200 OK
 *    {
 *     [{"nome": "Pessoa 1", "senha": "123", "email":"pessoa1@email.com"},
        {"nome": "Pessoa 2", "senha": "123", "email":"pessoa2@email.com"}]
 *    }
 *
 *
 * @apiError Erro Erro interno do servidor.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": erro
 *     }
 */
router.get("/", function(request, response){

  Pessoa.buscar(function(erro, dados){
    if(erro){
      response.json({error: erro});
    }else {
      response.json(dados);
    }
  });
});

/**
 * @api {post} /cadastrar
 * @apiGroup Pessoa
 *
 * @apiParam {String} nome Obrigatório
 * @apiParam {String} senha Obrigatório
 * @apiParam {String} email Obrigatório
 * @apiParam {String} bicicleta Opcional
 *
 * @apiSuccess {String} ok Cadastro ocorreu com sucesso.
 *
 * @apiSuccessExample {json} Sucesso
 *    HTTP/1.1 200 OK
 *    {
 *      "ok": "ok"
 *    }
 *
 *
 * @apiError Erro Erros.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": erro
 *     }

 * @apiError Erro Bad Request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       status: 400
 *     }
 *
 * @apiError Erro Email já cadastrado.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 Email já cadastrado
 *     {
 *        erro: "Email já cadastrado!"
 *     }
 */
router.post("/cadastrar", function(request, response){
  var nome = request.body.nome;
  var email = request.body.email;
  var senha = request.body.senha;

  if(!nome || !email || !senha)
    return response.sendStatus(400);

  pessoaSalvar = new Pessoa();
  pessoaSalvar.nome = nome;
  pessoaSalvar.senha = senha;
  pessoaSalvar.email = email;

  Pessoa.findOne({email: email}, function(erro, dados){
    if(erro){
      response.json({error: erro});
    }else if(dados != null){
      response.json({erro:"Email já cadastrada"});
    }else{
      pessoaSalvar.save(function(err){
        if(err)
          return response.sendStatus(500);

        response.json({ok:"ok"});
      });
    }
  });
});


/**
 * @api {post} /login
 * @apiGroup Pessoa
 *
 * @apiParam {String} senha Obrigatório
 * @apiParam {String} email Obrigatório
 *
 * @apiSuccess {Pessoa} pessoa Retorna os dados da pessoa.
 *
 * @apiSuccessExample {json} Sucesso
 *    HTTP/1.1 200 OK
 *    {
 *      "pessoa": {_id:"as334fdd5G23", "nome": "Pessoa 2", "senha": "123", "email":"pessoa2@email.com"}
 *    }
 *
 * @apiError Erro Erros.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": erro
 *     }

 * @apiError Erro Bad Request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       status: 400
 *     }
 */
router.post("/login", function(request, response){
  var email = request.body.email;
  var senha = request.body.senha;
  console.log(email);
  if(!email || !senha)
    return response.sendStatus(400);

  pessoaSalvar = new Pessoa();
  pessoaSalvar.senha = senha;
  pessoaSalvar.email = email;

  Pessoa.findOne({email: email, senha:senha}, function(erro, dados){
      if(erro){
        response.json({error: erro});
      }else{
        response.json(dados);
      }
    });
  });


  /**
   * @api {put} /editar
   * @apiGroup Pessoa

   * @apiParam {String} _id   Obrigatório
   * @apiParam {String} senha Opcional
   * @apiParam {String} email Opcional
   * @apiParam {String} senha Opcional
   * @apiParam {String} email Opcional
   *
   * @apiSuccess {Pessoa} pessoa Retorna os dados atualizados de uma pessoa.
   *
   * @apiSuccessExample {json} Sucesso
   *    HTTP/1.1 200 OK
   *    {
   *      "pessoa": {_id:"as334fdd5G23", "nome": "Pessoa 2", "senha": "123", "email":"pessoa2@email.com"}
   *    }
   *
   * @apiError Erro Erros.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": erro
   *     }

   * @apiError Erro Bad Request.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       status: 400
   *     }
   */
router.put("/editar", function(request, response){
  var dados = request.body.pessoa;

  if(!dados)
    return response.sendStatus(400);

  var json = JSON.parse(dados);

  pessoaEditar = new Pessoa(json);

  Pessoa.findOne({_id:pessoaEditar._id}, function(err, pessoa){
    if(err)
      return response.sendStatus(500);

    pessoa.nome = pessoaEditar.nome;
    pessoa.email = pessoaEditar.email;
    pessoa.senha = pessoaEditar.senha;

    pessoa.save(function(err){
      if(err)
        return response.sendStatus(500);

      response.json({ok:"ok"});
    });
  });
});

/**
 * @api {delete} /editar
 * @apiGroup Pessoa

 * @apiParam {String} _id   Obrigatório
 *
 * @apiSuccess {String} ok Sucesso em deletar uma pessoa.
 *
 * @apiSuccessExample {json} Sucesso
 *    HTTP/1.1 200 OK
 *    {
 *      "ok":"ok"
 *    }
 *
 * @apiError Erro Erros.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": erro
 *     }

 * @apiError Erro Bad Request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       status: 400
 *     }
 */
router.delete("/excluir", function(request, response){
  var dados = request.body.pessoa;

  if(!dados)
    return response.sendStatus(400);

  var json = JSON.parse(dados);

  pessoaExcluir = new Pessoa(json);

  Pessoa.remove({_id:pessoaExcluir._id}, function(err){
    if(err)
      return response.sendStatus(500);

    response.json({ok:"ok"});
  });
});

module.exports = router;
