var express = require("express");
var router = express.Router(); 

var indexController = require("../controllers/indexController");

router.get("/", indexController);

module.exports = router;
