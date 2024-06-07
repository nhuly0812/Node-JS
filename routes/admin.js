var express = require("express");
var router = express.Router();

var cartController = require("../controllers/cartController");
var categoryController = require("../controllers/categoryController");
var bookController = require("../controllers/bookController");
var usersController = require("../controllers/usersController");
var homeController = require("../controllers/homeController");

router.get("/cart", cartController);
router.get("/category", categoryController);
router.get("/book", bookController);
router.get("/users", usersController);
router.get("/home", homeController);

module.exports = router;
