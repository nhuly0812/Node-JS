var express = require("express");
var router = express.Router(); 

// import các controllers 
var indexController = require("../controllers/indexController");

//Định nghĩa các tuyến đường  liên kết với một controller cụ thể
router.get("/", indexController);

//uất router để có thể được sử dụng trong các file khác 
module.exports = router;
