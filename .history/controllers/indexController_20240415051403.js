var express = require("express");
var router = express.Router(); 
var db = require("../models/database"); 
const session = require("express-session");

router.get("/", function (req, res) {
  res.render("client/index");
});
router.get("/about", (req, res, next) => {
  res.render("client/about");
});
router.get("/contact", (req, res, next) => {
  res.render("client/contact");
});


router.get("/product/api", (req, res, next) => {
  let sqlBook = `SELECT id, name, description, imageURL, price, idCategory FROM books;`;
    db.query(sqlBook, (err, books) => {
      if (err) throw err;
      res.json(books); 
    });
  });

router.get("/category/api", (req, res, next) => {
  let sql = `SELECT idCategory AS id, name FROM category;`;
  db.query(sql, (err, loai) => {
    if (err) throw err;
    res.json(loai);
  });
});


router.get("/product", async (req, res, next) => {
  try {
    const newdata = await readApi("http://localhost:5000/product/api");
    const category = await readApi("http://localhost:5000/category/api");
    const data = await filterData(0, newdata);

    res.render("client/listbook", { newdata, data, category });
  } catch (error) {
    console.log(error);
  }
});

router.get("/product/:name/category", async (req, res, next) => {
  const name = req.params.name; 
  const data = await readApi("http://localhost:5000/product/api");
  const category = await readApi("http://localhost:5000/category/api");
  const product = await filterData(name, data); 

  res.render("client/productCategory", { data, product, category });
});

//để gửi yêu cầu HTTP và lấy dữ liệu từ phản hồi của API
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
const filterData = (category, data) => {
  const newData = data.filter((item) => item.idCategory === category);

  return newData;
};

router.get("/detailbook/:id", (req, res) => {
  let id = req.params.id;
  let sqlBook = `SELECT * FROM books WHERE id=${id}`;
  db.query(sqlBook, (err, sach) => {
    if (err) throw err;
    res.render("client/detailBook", { book: sach[0] }); 
  });
});

lor

router.get("/register", (req, res, next) => {
  res.render("client/register");
});
router.get("/login", (req, res, next) => {
  res.render("client/login");
});


router.use(
  session({
    secret: "secret", 
    resave: true, 
    saveUninitialized: true, 
  })
);

router.post("/register", (req, res) => {
  const { fullName, password, email, address } = req.body; 
  const sql = `INSERT INTO users (fullName, password, email,address) VALUES (?, ?, ?,?)`; 
  db.query(sql, [fullName, password, email, address], (err, result) => {
    res.render("client/login");
  });
});

router.post("/login", (req, res) => {
  const { fullName, password } = req.body;
  const sql = `SELECT * FROM users WHERE fullName = ? AND password = ?`; 
  db.query(sql, [fullName, password], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Đăng nhập không thành công.");
    } else {
      if (result.length > 0) { 
        req.session.loggedin = true; 
        req.session.fullName = fullName; //lưu vào phiên làm việc 
        res.redirect("/admin"); 
      } else { 
        res.send("Tên người dùng hoặc mật khẩu không đúng.");
      }
    }
  });
});



router.post("/add-cart", (req, res) => {
  const idProduct = req.body.idProduct;
  db.query(`INSERT INTO cart (id) VALUES ('${idProduct}')`, (err, data) => { 
    if (err) throw err;
    res.redirect("/cart123");
  });
});


router.get("/cart123", function (req, res, next) {
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
    res.render("client/cart", { data: arrNew });
  });
});

router.get("/cartdelete/:id", (req, res) => {
  let id = req.params.id; 
  let sql = `DELETE FROM cart WHERE id = ?`;
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/cart123");
  });
});


module.exports = router;
