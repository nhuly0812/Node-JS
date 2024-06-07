var express = require("express");
var router = express.Router(); 

var indexController = require("../controllers/indexController");

router.get("/", indexController);

//uất router để có thể được sử dụng trong các file khác 
module.exports = router;
