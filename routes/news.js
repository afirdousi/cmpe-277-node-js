var express = require('express');
var router = express.Router();

var newsDataEngine = require('../data/news');


/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.json({id:-1,title:'Test News Title',detail:'Test News Detail'});
});


router.get('/:id',function (req, res, next) {

  newsDataEngine.helloWorld();

  var newsID = req.params.id;
  res.json({id:newsID,title:'Title of news with ID:'+ newsID,detail:'Details of news with ID:'+ newsID});
});


module.exports = router;
