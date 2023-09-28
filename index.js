const express = require("express");
const app = express(); // inisialisasi
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const fileUpload = require("express-fileupload");
const path = require("path");
const port = 3005;
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://food-recipe-react-six.vercel.app"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
    allowedHeaders: ["Content-Type", "Authorization","Access-Control-Allow-Origin"],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(xss());
app.use(helmet());
// app.use(cors({
//   "origin": "*",
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
// }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/images", express.static(path.join(__dirname, "public")));
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "app runing",
  });
});

// //menjalankan express dan port variabel diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
