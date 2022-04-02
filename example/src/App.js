import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";

const DeepgramHandler = (props) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const uploadFile = (file) => {
        console.log("Uploading file...", file);
        const API_ENDPOINT = "http://localhost:8080/audio";

        const formData = new FormData()
        formData.append('username', 'Sandra Rodgers')
        // formData.append('file', file)
        formData.append("file", file);

        fetch(API_ENDPOINT, {
            method: "post",
            body: formData,
        })
            .then((res) => console.log(res))
            .catch((err) => ("Error occurred", err));
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
        </>
    );
};

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    <DeepgramHandler>
                        <input style={{ padding: 15 }} />
                    </DeepgramHandler>
                </p>
            </header>
        </div>
    );
}

const styles = React.createS;

export default App;
