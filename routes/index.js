var express = require('express');
var router = express.Router();
var codes = require('../custom/codes');

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/check_code', function(req, res) {
  var token = req.query.code;
  res.json({
    success: codes.findCode(token)
  });
})

module.exports = router;
