
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/smb-db', function(error){
  if (error) {
    console.log("Error! Connection not found!");
  }
  else {
    console.log("Connected.");
  }
});

mongoose.set('debug', true);
module.exports = mongoose;
