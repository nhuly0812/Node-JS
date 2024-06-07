var express = require("express");
var router = express.Router();
var db = require("../models/database");


router.get("/cartAdmin", function (req, res, next) {
  let sql = `SELECT id FROM cart`;
  const arr = [];
  db.query(sql, async (err, data) => {
    data.forEach((item) => {
      arr.push(item.id);
    });
    const dataPro = await fetch("http://localhost:5000/product/api");
    const products = await dataPro.json();
    const arrNew = [];
    arr.forEach((item) => {
      products.forEach((item2) => {
        if (item === item2.id) {
          arrNew.push(item2);
        }
      });
    });
    res.render("admin/cartList", { data: arrNew ,   layout: "layouts/layout_admin"});
  });
});


router.get("/cartdelete/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  let sql = `DELETE FROM cart WHERE id = ?`;
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/admin/cartAdmin");
  });
});

module.exports = router;
