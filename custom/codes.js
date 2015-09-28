var path = require('path'),
    fs = require('fs');

var result = fs.readFileSync(path.join(__dirname, 'codes_data.csv'), 'utf8')
  .split(',').map(function(code){
    return code.replace(/^\s+|\s+$/g, '');
  }).filter(function(c){
    return c;
  });

module.exports = function(codes) {
  var codes = codes;
  return {
    findCode: function(code) {
      return codes.indexOf(code) != -1;
    }
  }
}(result);
