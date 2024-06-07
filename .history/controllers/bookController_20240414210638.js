var express = require("express");
var router = express.Router();
var db = require("../models/database");
const multer = require("multer");

let urlImage;
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, "public/images");
    } else {
      cb(new Error("not image"), false);
    }
  },
  //xác định tên là thời gian tải lên
  filename: (req, file, cb) => {
    urlImage = Date.now() + ".jpg";
    cb(null, urlImage);
  },
});
var upload = multer({ storage: storage });

router.get("/bookaddnew", async function (req, res, next) {
  // const category = await readApi("http://localhost:5000/category/api");
  res.render("admin/bookaddnew", { layout: "layouts/layout_admin", category });
});

router.post("/addBook", upload.single("imageURL"), function (req, res, next) {
  const file = req.file;
  if (!file) {
    const error = new Error("Hãy upload file");
    return next(error);
  }
  let product = {
    name: req.body.name,
    description: req.body.description,
    imageURL: urlImage, // Sử dụng biến urlImage được lưu trữ từ multer
    price: req.body.price,
    // hidden: req.body.hidden,
    updateBook: req.body.updateBook,
    idCategory: req.body.idCategory,
  };

  db.query("INSERT INTO books SET ?", product, (err, data) => {
    if (err) throw err;
    res.redirect("/admin/bookList");
  });
});

router.get("/booklist", function (req, res, next) {
  let sql = `SELECT id, name, description, imageURL,updateBook, price FROM books`;
  db.query(sql, (err, data) => {
    res.render("admin/bookList", {
      list: data,
      layout: "layouts/layout_admin",
    });
  });
});

const readApi = async (endPoint) => {
  try {
    const response = await fetch(endPoint);

    if (!response.ok) {
      throw new Error("Cannot fetch data");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

module.exports = readApi;

router.get("/bookedit/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `SELECT * FROM books WHERE id = ?`;
  db.query(sql, id, (err, d) => {
    res.render("admin/bookEdit", {
      book: d[0],
      layout: "layouts/layout_admin",
    });
  });
});

router.post(
  "/updatebook",
  upload.single("imageURL"),
  function (req, res, next) {
    const file = req.file;
    if (!file) {
      const error = new Error("Hãy upload file");
      return next(error);
    }
    let id = req.body.id;
    let n = req.body.name;
    let mt = req.body.description;
    let g = req.body.price;
    let img = file.filename;

    db.query(
      `UPDATE books SET name = ?, description = ?,price = ?,imageURL = ? WHERE id = ?`,
      [n, mt, g, img, id],
      (err, data) => {
        if (data.affectedRows == 0) {
          console.log(`Không có id loại ${id} để cập nhập`);
        }
        res.redirect("/admin/bookList");
      }
    );
  }
);

router.get("/bookdelete/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  let sql = `DELETE FROM books WHERE id = ?`;
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/admin/bookList");
  });
});

module.exports = router;
