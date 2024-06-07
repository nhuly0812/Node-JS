var express = require("express");
var router = express.Router();

// import các controllers 
var cartController = require("../controllers/cartController");
var categoryController = require("../controllers/categoryController");
var bookController = require("../controllers/bookController");
var usersController = require("../controllers/usersController");
var homeController = require("../controllers/homeController");

//Định nghĩa các tuyến đường  liên kết với một controller cụ thể
router.get("/cart", cartController);
router.get("/category", categoryController);
router.get("/book", bookController);
router.get("/users", usersController);
router.get("/home", homeController);

//uất router để có thể được sử dụng trong các file khác 
module.exports = router;
