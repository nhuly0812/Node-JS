var express = require("express");
var router = express.Router();
var db = require("../models/database");


router.get("/categorylist", function (req, res, next) {
  let sql = `SELECT * FROM category`;
  db.query(sql, (err, data) => {
    res.render("admin/categoryList", {
      list: data,
      layout: "layouts/layout_admin",
    });
  });
});
router.get("/categoryaddnew", function (req, res, next) {
  res.render("admin/categoryAddnew", { layout: "layouts/layout_admin" });
});


router.post("/add", function (req, res, next) {
  let tl = req.body.name;
  let ah = req.body.hidden;

  let category = { name: tl, hidden: ah };
  db.query("INSERT INTO category SET ?", category, (err, data) => { 
    if (err) throw err;
    res.redirect("/admin/categoryList"); // Chuyển hướng đến 
  });
});

router.get("/categoryedit/:id", function (req, res, next) {
  var id = req.params.id;
  let sql = `SELECT idCategory, name, hidden FROM category WHERE idCategory=${id}`; //là lấy dữ liệu  idCategory, name, hidden từ from category điều kiện idCategory bằng id url
  db.query(sql, (err, data) => {
    res.render("admin/categoryEdit", {category: data[0], layout: "layouts/layout_admin", });
  });
});

router.post("/update", function (req, res, next) {
//lấy dữ liệu từ form bằng req.body
  let id = req.body.id;
  let tl = req.body.name;
  let ah = req.body.hidden;
  db.query(`UPDATE category SET name = ?, hidden = ? WHERE idCategory = ?`,[tl, ah, id],//update vào bảng category dữ liệu của name và hidden điều kiện idCategory = id  
    (err, data) => {
      if (data.affectedRows == 0) {//dữ liệu trả về không có 
        console.log(`Không có id loại ${id} để cập nhập`);
      }
      res.redirect("/admin/categoryList");
    }
  );
});

router.get("/categorydelete/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  let sql = `DELETE FROM category WHERE idCategory = ?`;
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/admin/categoryList");
  });
});


module.exports = router;
