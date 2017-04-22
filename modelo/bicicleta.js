var mongoose = require('../conexao/mongo');

var schema = mongoose.Schema;

var BicicletaSchema = schema({
    identificador:{type:String, require:true},
    listaViagens:[{
      nome:{type:String, require:true},
      listaLoc:[{
        latitude:{type:Number, require:true},
        longitude:{type:Number, require:true},
        time:{type:Number, require:false}
      }]
    }]
}, {versionKey: false});

BicicletaSchema.statics.buscarBikeIdentificador = function(identificador, resposta){
  this.findOne({identificador:identificador})
  .exec(resposta);
};

BicicletaSchema.statics.buscar = function(resposta){
  this.find()
  .exec(resposta);
};

module.exports = mongoose.model('Bicicleta', BicicletaSchema);
