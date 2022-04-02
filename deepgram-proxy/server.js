const express = require("express");
var cors = require("cors");
var app = express();

const deepgramApiKey = "x";

const deepgramTranscript = async (deepgramApiKey, filepath, filemime = 'audio/wav') => {
    const deepgram = new Deepgram(deepgramApiKey);
    const mimetype = filemime;
    const file = filepath;
    const audio = fs.readFileSync(file);

    // Set the source
    source = {
        buffer: audio,
        mimetype: mimetype,
    };

    let finalResponse = {}

    // Send the audio to Deepgram and get the response
    await deepgram.transcription
        .preRecorded(source, {
            punctuate: true,
        })
        .then((response) => {
            // Write the response to the console
//            finalResponse = response
            finalResponse = response.results.channels[0].alternatives[0].transcript
            // Write only the transcript to the console
            //console.dir(response.results.channels[0].alternatives[0].transcript, { depth: null });
        })
        .catch((err) => {
            finalResponse = err
        });

    return finalResponse;
}

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
    let filepath = req.file.path
    res.send({ message: "Successfully uploaded: " + req.file.path });
});

app.post("/audiotranscript", upload.single("file"), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    let filepath = req.file.path
    let transcript = await deepgramTranscript(deepgramApiKey, filepath);
    res.send({ transcript: transcript });
});

const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");

app.get("/deepgram", async (req, res) => {
    let transcript = await deepgramTranscript(deepgramApiKey, 'uploads/1311.wav');
    res.json(transcript);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
