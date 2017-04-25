var Ambiente = require('../modelo/ambiente');

var express = require('express');
var router = express.Router();

router.get("/", function(request, response){
  Ambiente.buscar(function(erro, dados){
    if(erro){
      response.json({error: erro});
    }else {
      response.json(dados);
    }
  });
});

module.exports = router;
