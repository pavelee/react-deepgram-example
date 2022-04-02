const express = require("express");
var cors = require("cors");
var app = express();

const multer = require("multer");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, parseInt(Math.random() * 100000) + ".wav");
    },
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
});

const upload = multer({ storage });

app.use(cors());

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/audio", upload.single("file"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send({ message: "Successfully uploaded: " + req.file.filename });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
