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

router.get("/product/:id/category", async (req, res, next) => {
  const id = req.params.id; 
  const data = await readApi("http://localhost:5000/product/api");
  const category = await readApi("http://localhost:5000/category/api");
  const product = await filterData(id, data); 

  res.render("client/productCategory", { data, product, category });
});

//để gửi yêu cầu HTTP và lấy dữ liệu từ phản hồi của API
const readApi = async (endPoint) => {
  try {
    const response = await fetch(endPoint); //sử dụng fetch() để gửi yêu cầu

    if (!response.ok) {
      throw new Error("Cannot fetch data");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
// lọc dữ liệu dựa trên một danh mục cụ thể được chỉ định
const filterData = (category, data) => {
  const newData = data.filter((item) => item.idCategory === category);

  return newData;
};

//để render trang chi tiết sp dựa trên ID của sách.
router.get("/detailbook/:id", (req, res) => {
  let id = req.params.id;
  let sqlBook = `SELECT * FROM books WHERE id=${id}`;
  db.query(sqlBook, (err, sach) => {
    if (err) throw err;
    res.render("client/detailBook", { book: sach[0] }); //nạp
  });
});




//để render trang đăng ký và đăng nhập.
router.get("/register", (req, res, next) => {
  res.render("client/register");
});
router.get("/login", (req, res, next) => {
  res.render("client/login");
});

// Sử dụng session, đã được cấu hình để quản lý thông tin phiên của người dùng
router.use(
  session({
    secret: "secret", //chuỗi bí mật được sử dụng để mã hóa dữ liệu
    resave: true, //phiên sẽ được lưu lại mỗi khi có yêu cầu
    saveUninitialized: true, //được lưu trữ ngay cả khi không có dữ liệu phiên được thiết lập
  })
);

// thêm thông tin người dùng mới vào cơ sở dữ liệu
router.post("/register", (req, res) => {
  const { fullName, password, email, address } = req.body; //lấy dữ liệu từ form
  const sql = `INSERT INTO users (fullName, password, email,address) VALUES (?, ?, ?,?)`; //sẽ được chèn thêm vào các cột tương ứng của bảng users.
  db.query(sql, [fullName, password, email, address], (err, result) => {
    res.render("client/login");
  });
});
// lấy thông tin từ csdl rồi ktra có khớp hay không 
router.post("/login", (req, res) => {
  const { fullName, password } = req.body;
  const sql = `SELECT * FROM users WHERE fullName = ? AND password = ?`; //SELECT được tạo để lấy thông tin người dùng từ cơ sở dữ liệu dựa trên fullName và password nhận được từ form đăng nhập.
  db.query(sql, [fullName, password], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Đăng nhập không thành công.");
    } else {
      if (result.length > 0) { //resul tồn tại( tức là có dữ liệu trả về )
        req.session.loggedin = true; //lưu vào phiên làm việc 
        req.session.fullName = fullName; //lưu vào phiên làm việc 
        res.redirect("/admin"); // Chuyển hướng sau khi đăng nhập thành công
      } else { 
        res.send("Tên người dùng hoặc mật khẩu không đúng.");
      }
    }
  });
});



//thêm một sản phẩm vào giỏ hàng khi người dùng nhấn nút
router.post("/add-cart", (req, res) => {
  const idProduct = req.body.idProduct;
  db.query(`INSERT INTO cart (id) VALUES ('${idProduct}')`, (err, data) => { //chèn giá trị idProduct vào id của bảng cart
    if (err) throw err;
    res.redirect("/cart123");
  });
});


//để lấy dữ liệu giỏ hàng từ cơ sở dữ liệu và hiển thị trên trang giỏ hàng
router.get("/cart123", function (req, res, next) {
  let sql = `SELECT id FROM cart`;
  const arr = [];
  db.query(sql, async (err, data) => {
    data.forEach((item) => { //lặp qua kết quả truy vấn
      arr.push(item.id); //thêm id vào arr
    });
    const dataPro = await fetch("http://localhost:5000/product/api");
    const products = await dataPro.json();
    const arrNew = [];
    arr.forEach((item) => {
      products.forEach((item2) => {
        if (item === item2.id) {       //So sánh id sản phẩm trên csdl trên với id sản phẩm từ api
          arrNew.push(item2);
        }
      });
    });
    res.render("client/cart", { data: arrNew });
  });
});

//xóa một mục khỏi giỏ hàng.
router.get("/cartdelete/:id", (req, res) => {
  let id = req.params.id; //lấy tham số id
  let sql = `DELETE FROM cart WHERE id = ?`; //là xóa bản ghi từ  bảng cart điều kiện là id = id cụ thể
  db.query(sql, [id], (err, data) => {
    if (data.affectedRows == 0) {
      console.log(`Không có loại ${id} để xóa`);
    }
    res.redirect("/cart123");
  });
});


module.exports = router;
