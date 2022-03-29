const express = require("express");
var cors = require("cors");
var app = express();

app.use(cors());

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/audio", (req, res) => {
    console.log(req);
    res.json("Successful post");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
