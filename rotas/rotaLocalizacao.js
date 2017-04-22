var Localizacao = require('../modelo/localizacao');
var Bicicleta = require('../modelo/bicicleta');
var Ambiente = require('../modelo/ambiente');

var express = require('express');
var router = express.Router();


/**
 * @api {get} /:bike0001:-4.568749:-39.763299
 * @apiGroup Localizacao

 * @apiParam {String} identificador   Obrigatório
 * @apiParam {String} latitude        Obrigatório
 * @apiParam {String} longitude       Obrigatório
 *
 * @apiSuccess {Localizacao} dados retorna a localização de uma bicicleta.
 *
 * @apiSuccessExample {json} Sucesso
 *    HTTP/1.1 200 OK
 *    {
 *      ok:"ok"
 *    }
 *
 * @apiError Erro Erros.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       status: 500
 *     }
 *
 * @apiError Erro Bad Request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       status: 400
 *     }
 *
 * @apiError Erro erro.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1
 *     {
 *       error: erro
 *     }
 *
 */
router.get('/:valor', function(request, response) {
  var string = request.params.valor;

  var resultado = string.split(":");
  var identificador = resultado[0];
  var lat = resultado[1];
  var lon = resultado[2];
  var co2 = resultado[3];
  var som = resultado[4];
  var temperatura = resultado[5];
  var umidade = resultado[6];

  console.log("VALORES DA REQUISICAO: ");
  console.log(identificador);
  console.log(lat);
  console.log(lon);
  console.log(co2);
  console.log(som);
  console.log(temperatura);
  console.log(umidade);

  loc = new Localizacao();
  loc.latitude = lat;
  loc.longitude = lon;
  loc.bicicleta = identificador;

  var date = new Date();
  var dataCompleta = date.getDate() + "/" +
                  (date.getMonth()+1) + "/" +
                   date.getFullYear() + " " +
                   date.getHours()+":"+
                   date.getMinutes() + " hs";

  console.log(dataCompleta);

  ambiente = new Ambiente();
  ambiente.latitude = lat;
  ambiente.longitude = lon;
  ambiente.nivelCo2 = co2;
  ambiente.nivelSonoro = som;
  ambiente.temperatura = temperatura;
  ambiente.umidade = umidade;
  ambiente.data = dataCompleta;

  console.log(loc);
  console.log(ambiente);

  Ambiente.buscarPorLocalizacao(lat, lon, function(erro, amb){
    if(erro){
      return response.sendStatus(500);
    }else if(amb != null){
      console.log("encontrado o ambiente");
      amb.nivelCo2 = ambiente.nivelCo2;
      amb.nivelSonoro = ambiente.nivelSonoro;
      amb.temperatura = ambiente.temperatura;
      amb.umidade = ambiente.umidade;
      amb.data = dataCompleta;


      amb.save(function(err){
        if(err)
          return response.sendStatus(500);
      })
    }else{
      console.log(ambiente);
      ambiente.save(function(err){
        if(err)
          return response.sendStatus(500);
      })
    }
  });

  Bicicleta.buscarBikeIdentificador(identificador, function(erro, bicicleta){
    if(erro){
      response.json({error: erro});
    }
    if(bicicleta != null){
      Localizacao.buscarPorBicicleta(identificador, function(erro, dados){
        if(erro){
          response.json({error: erro});
        }
        if(dados == null){
          loc.save(function(err){
            if(err)
              return response.sendStatus(500);
          })
        }
        else{
            dados.latitude = loc.latitude;
            dados.longitude = loc.longitude;

            dados.save(function(err){
              if(err)
                return response.sendStatus(500);
            });
        }
        response.json({ok:"ok"});
      });
    }
  });
});

/**
 * @api {post} /bike
 * @apiGroup Localizacao

 * @apiParam {String} identificador   Obrigatório
 *
 * @apiSuccess {Localizacao} dados retorna a localização de uma bicicleta.
 *
 * @apiSuccessExample {json} Sucesso
 *    HTTP/1.1 200 OK
 *    {
 *      dados: {"latitude":5555, "longitude":4444, "bicicleta":"bike0007"}
 *    }
 *
 * @apiError Erro Erros.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 Error erro
 *     {
 *       error: erro
 *     }

 * @apiError Erro Bad Request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       status: 400
 *     }
 */
router.post("/bike", function(request, response){

  var identificador = request.body.identificador;

  if(!identificador)
    return response.sendStatus(400);

  Localizacao.buscarPorBicicleta(identificador, function(erro, dados){
    if(erro){
      response.json({error: erro});
    }else {
      response.json(dados);
    }
  });
});

module.exports = router;
