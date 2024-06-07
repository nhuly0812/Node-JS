var express = require("express");
var router = express.Router();
var db = require("../models/database");


router.get("/", (req, res, next) => {
    let sql = `SELECT * FROM users`;
    let sqlCategory = `SELECT * FROM category`;
    let sqlBook = `SELECT * FROM books`;
    db.query(sql, (err, data) => {
      db.query(sqlCategory, (err, dataCategory) => {
        db.query(sqlBook, (err, databook) => {
    res.render("admin/list",{   list:dataCategory ,users: data,listBook: databook,
      layout: "layouts/layout_admin"});
  });
  });
  });
});


 
router.get("/deleteCt/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  let sqlCt = `DELETE FROM category WHERE idCategory = ?`;
  let sqlUs = `DELETE FROM users WHERE idUser = ?`;
  let sqlB = `DELETE FROM books WHERE id = ?`;

  db.query(sqlCt,sqlUs, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/admin/");
  });
});


router.get("/deleteUs/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  let sql = `DELETE FROM users WHERE idUser = ?`;
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/admin/");
  });
});


router.get("/deletePr/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/admin/");
  });
});

  module.exports = router;

  