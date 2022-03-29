import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";

const DeepgramHandler = (props) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const uploadFile = file => {
        console.log("Uploading file...");
        const API_ENDPOINT = "http://localhost:8080/audio";
        const request = new XMLHttpRequest();
        const formData = new FormData();
      
        request.open("POST", API_ENDPOINT, true);
        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 200) {
            console.log(request.responseText);
          }
        };
        formData.append("file", file);
        request.send(formData);
      };

    const startRecord = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mr = new MediaRecorder(stream);
            setMediaRecorder(mr);

            mr.start();

            const audioChunks = [];

            mr.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });

            mr.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                console.log(audioBlob);
                uploadFile(audioBlob);
                //const audioUrl = URL.createObjectURL(audioBlob);
                //const audio = new Audio(audioUrl);
                //console.log(audio);
                //audio.play();
            });

            //   setTimeout(() => {
            //     mr.stop();
            //   }, 3000);
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
