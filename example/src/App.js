import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

const DeepgramHandler = (props) => {
    const { setValue } = props;
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [transcript, setTranscript] = useState(null);
    const [fetchingTranscript, setFetchingTranscript] = useState(false);

    useEffect(() => {
        if (setValue && transcript) {
            setValue(transcript);
        }
    }, [transcript]);

    const uploadFile = (file) => {
        console.log("Uploading file...", file);
        const API_ENDPOINT = "http://localhost:8080/audiotranscript";

        const formData = new FormData();
        formData.append("username", "Sandra Rodgers");
        // formData.append('file', file)
        formData.append("file", file);

        setFetchingTranscript(true);
        fetch(API_ENDPOINT, {
            method: "post",
            body: formData,
        })
            .then((response) => response.json())
            .then((res) => {
                setTranscript(res.transcript);
                setFetchingTranscript(false);
            })
            .catch((err) => {
                console.log(err);
                setFetchingTranscript(false);
            });
    };

    const startRecord = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mr = new MediaRecorder(stream);
            setMediaRecorder(mr);

            const audioChunks = [];

            mr.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });

            mr.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                uploadFile(audioBlob);
            });

            mr.start();
        });
    };

    const stopRecord = (mediaRecorder) => {
        mediaRecorder.stop();
        setMediaRecorder(null);
    };

    return (
        <>
            <button
                onClick={() => {
                    startRecord();
                }}
            >
                transcript
            </button>
            {mediaRecorder && (
                <button onClick={() => stopRecord(mediaRecorder)}>stop!</button>
            )}

            {props.children}

            {fetchingTranscript && <p>fetching transcript...</p>}
            {transcript && <p>{transcript}</p>}
        </>
    );
};

function App() {
    const [value, setValue] = useState("");
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    <DeepgramHandler setValue={setValue}>
                        <input
                            value={value}
                            onChange={(ev) => {
                                setValue(ev.target.value);
                            }}
                            style={{ padding: 15 }}
                        />
                    </DeepgramHandler>
                </p>
            </header>
        </div>
    );
}

const styles = React.createS;

export default App;
