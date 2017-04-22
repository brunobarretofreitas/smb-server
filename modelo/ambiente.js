var mongoose = require('../conexao/mongo');

var schema = mongoose.Schema;

var AmbienteSchema = schema({
  latitude:{type:String, require:true},
  longitude: {type:String, require:true},
  nivelCo2: {type:String, require:true},
  nivelSonoro: {type: String, required: true},
  temperatura: {type: String, required: true},
  umidade: {type: String, required: true},
  data: {type: String, required: true}
}, {versionKey: false});

AmbienteSchema.statics.buscar = function(retorno){
  this.find({})
  .exec(retorno);
};

AmbienteSchema.statics.buscarPorLocalizacao = function(latitude, longitude, resposta){
  this.findOne({latitude:latitude, longitude: longitude})
  .exec(resposta);
}

module.exports = mongoose.model('Ambiente', AmbienteSchema);
