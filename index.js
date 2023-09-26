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


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(xss());
app.use(helmet());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// app.use(cors());
app.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, simandesk_token'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

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
