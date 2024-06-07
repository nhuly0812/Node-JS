const createError = require("http-errors"); //Thư viện để tạo ra các lỗi HTTP dễ dàng.
const express = require("express"); //Framework web cho Node.js
const path = require("path"); //Module Node.js để làm việc với đường dẫn file và thư mục.
const cookieParser = require("cookie-parser"); //Middleware để xử lý cookie.
const logger = require("morgan"); //Middleware để ghi log các yêu cầu HTTP.
const expressLayouts = require("express-ejs-layouts"); //Middleware để sử dụng layout trong Express với EJS

//Đây là các tập tin chứa các tuyến đường (routes) và logic xử lý cho các tuyến đường đó.
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");

const adminCartRouter = require("./controllers/cartController");
const adminCategoryRouter = require("./controllers/categoryController");
const adminBookRouter = require("./controllers/bookController");
const adminUsersRouter = require("./controllers/usersController");
const adminHomeRouter = require("./controllers/homeController");
const adminIndexRouter = require("./controllers/indexController");

const app = express();

// Sử dụng express-ejs-layouts
app.use(expressLayouts);

// Cài đặt thư mục views và view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Định nghĩa layout mặc định cho express-ejs-layouts
app.set("layout", "layouts/layout");

//sử dụng để đăng ký các middleware để xử lý các yêu cầu HTTP
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/admin", adminRouter);

app.use("/admin", adminCategoryRouter);
app.use("/admin", adminBookRouter);
app.use("/admin", adminUsersRouter);
app.use("/admin", adminHomeRouter);
app.use("/admin", adminCartRouter);
app.use("/", adminIndexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
