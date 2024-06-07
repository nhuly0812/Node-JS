var express = require("express");
var router = express.Router();
var db = require("../models/database");



router.get("/userslist", function (req, res, next) {
  let sql = `SELECT * FROM users`;
  db.query(sql, (err, data) => {
    res.render("admin/usersList", {
      users: data,
      layout: "layouts/layout_admin",});
  });
});


router.get("/usersedit/:id", function (req, res, next) {
  var id = req.params.id;
  let sql = `SELECT idUser, fullName, password, email, address FROM users WHERE idUser=${id}`;
  db.query(sql, (err, data) => {
    res.render("admin/usersEdit", {
      users: data[0],
      layout: "layouts/layout_admin",
    });
  });
});

router.post("/usersupdate", function (req, res, next) {
  let id = req.body.id;
  let fn = req.body.fullName;
  let pw = req.body.password;
  let em = req.body.email;
  let ad = req.body.address;

  db.query(
    `UPDATE users SET fullName = ?, password = ?, email = ?, address = ? WHERE idUser = ?`,
    [fn, pw, em, ad, id],
    (err, data) => {
      if (data.affectedRows == 0) {
        console.log(`Không có id loại ${id} để cập nhập`);
      }
      res.redirect("/admin/usersList");
    }
  );
});

router.get("/usersdelete/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  let sql = `DELETE FROM users WHERE idUser = ?`;
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/admin/usersList");
  });
});

module.exports = router;
