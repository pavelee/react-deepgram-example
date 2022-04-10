const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");

const deepgramTranscript = async (
    deepgramApiKey,
    filepath,
    language = 'en',
    filemime = "audio/wav"
) => {
    const deepgram = new Deepgram(deepgramApiKey);
    const mimetype = filemime;
    const file = filepath;
    const audio = fs.readFileSync(file);

    source = {
        buffer: audio,
        mimetype: mimetype,
    };

    let finalResponse = {};

    await deepgram.transcription
        .preRecorded(source, {
            punctuate: true,
            language: language
        })
        .then((response) => {
            finalResponse =
                response.results.channels[0].alternatives[0].transcript;
        })
        .catch((err) => {
            finalResponse = err;
        });

    return finalResponse;
};

module.exports = deepgramTranscript
