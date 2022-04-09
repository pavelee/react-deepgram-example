// require our deps
const deepgramTranscript = require('./src/deepgram');
const upload = require('./src/upload');

// init express
const express = require("express");
var app = express();

// enable cors
var cors = require("cors");
app.use(cors());

// Constants
require('dotenv').config();
const deepgramApiKey = process.env.DEEPGRAM_API_KEY
const PORT = process.env.PORT;
const HOST = "0.0.0.0";

// endpoint to upload and transcript
app.post("/audiotranscript", upload.single("file"), async (req, res) => {
    let filepath = req.file.path
    let transcript = await deepgramTranscript(deepgramApiKey, filepath);
    res.send({ transcript: transcript });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
