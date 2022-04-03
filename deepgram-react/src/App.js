import { Form, Input, Popover, Button, Checkbox } from "antd";
import { Layout, Menu, Row, Col, Spin } from "antd";
import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";

const { Header, Content, Footer } = Layout;

const DeepgramHandler = (props) => {
    const {
        setValue,
        proxyUploadUrl,
        placement = "left",
        title = "Transcript your voice!",
        trigger="click"
    } = props;
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
        const API_ENDPOINT = proxyUploadUrl;

        const formData = new FormData();
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

    const recordPanel = (props) => {
        return (
            <>
                <Button
                    onClick={() => {
                        mediaRecorder
                            ? stopRecord(mediaRecorder)
                            : startRecord();
                    }}
                    type={mediaRecorder ? "danger" : "primary"}
                    block
                    loading={fetchingTranscript}
                >
                    {mediaRecorder && <span>stop!</span>}
                    {!mediaRecorder && <span>let's go!</span>}
                </Button>
            </>
        );
    };

    return (
        <>
            <Popover
                placement={placement}
                content={recordPanel()}
                title={title}
                trigger={trigger}
            >
                {props.children}
            </Popover>
        </>
    );
};

function App() {
    const proxyUploadUrl = "http://localhost:8080/audiotranscript"
    const [value, setValue] = useState("");
    return (
        <Layout className="layout">
            <Header>
                <div className="logo">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
            </Header>
            <Content style={{ paddingTop: 15, minHeight: "100vh" }}>
                <Row justify="center">
                    <Col span={12}>
                        <Form name="basic" autoComplete="off" layout="vertical">
                            <Form.Item label="My notes" name="note">
                                <DeepgramHandler setValue={setValue} proxyUploadUrl={proxyUploadUrl}>
                                    <Input.TextArea
                                        value={value}
                                        onChange={(ev) => {
                                            setValue(ev.target.value);
                                        }}
                                    />
                                </DeepgramHandler>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
            <Footer style={{ textAlign: "center" }}>Deepgram example!</Footer>
        </Layout>
    );
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
