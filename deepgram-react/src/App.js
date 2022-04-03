import { Form, Input, Popover, Button, Alert, Checkbox } from "antd";
import { Layout, Menu, Row, Col, Spin } from "antd";
import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";

const { Header, Content, Footer } = Layout;

const DeepgramHandler = (props) => {
    const { setValue, proxyUploadUrl } = props;
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [transcript, setTranscript] = useState(null);
    const [fetchingTranscript, setFetchingTranscript] = useState(false);

    // useEffect(() => {
    //     if (setValue && transcript) {
    //         setValue(transcript);
    //     }
    // }, [transcript]);

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
                if (res.transcript) {
                    setTranscript(res.transcript);
                }
                setFetchingTranscript(false);
            })
            .catch((err) => {
                console.log(err);
                setFetchingTranscript(false);
            });
    };

    const startRecord = () => {
        setTranscript(null);
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
        <div style={{ maxWidth: 300 }}>
            {/* <div style={{ marginBottom: 15 }}>
                <Alert
                    message="When you hit button below, you will ask to grant access to your microphone. We need that!"
                    type="info"
                    showIcon
                />
            </div> */}
            {mediaRecorder && (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 15,
                        marginBottom: 15,
                    }}
                >
                    <Spin tip="recording" />
                </div>
            )}
            {fetchingTranscript && (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 15,
                        marginBottom: 15,
                    }}
                >
                    <Spin tip="using deebgram AI to transcript..." />
                </div>
            )}
            {transcript && (
                <Form
                    layout={'vertical'}
                >
                    <Form.Item
                        label={'transcription'}
                    >
                        <Input.TextArea
                            value={transcript}
                            onChange={(ev) => {
                                setTranscript(ev.target.value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            block
                            onClick={() => {
                                setValue(transcript);
                            }}
                        >
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            )}
            <Button
                onClick={() => {
                    mediaRecorder ? stopRecord(mediaRecorder) : startRecord();
                }}
                type={mediaRecorder ? "danger" : "primary"}
                block
                loading={fetchingTranscript}
            >
                {mediaRecorder && <span>stop!</span>}
                {!mediaRecorder && <span>let's transcript!</span>}
            </Button>
        </div>
    );
};

const DeepgramHandlerPopover = (props) => {
    const {
        setValue,
        proxyUploadUrl,
        placement = "left",
        title = "Transcript your voice!",
        trigger = "click",
    } = props;

    const PopoverContent = () => {
        return (
            <DeepgramHandler
                setValue={setValue}
                proxyUploadUrl={proxyUploadUrl}
            />
        );
    };

    return (
        <Popover
            placement={placement}
            content={PopoverContent()}
            title={title}
            trigger={trigger}
        >
            {props.children}
        </Popover>
    );
};

function App() {
    const proxyUploadUrl = "http://localhost:8080/audiotranscript";
    const [value, setValue] = useState("");

    const setNotepadValue = (val) => {
        setValue(value + " " + val);
    };

    return (
        <Layout className="layout">
            <Header style={{ padding: 0 }}>
                <div className="logo">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
            </Header>
            <Content style={{ paddingTop: 15, minHeight: "100vh" }}>
                <Row justify="center">
                    <Col span={12}>
                        <h2>Notepad!</h2>
                        <p>
                            Use deepgram to take fast notes about anything! On
                            any device!
                        </p>
                        <Form name="basic" autoComplete="off" layout="vertical">
                            <Form.Item label="My notebook" name="note">
                                <DeepgramHandlerPopover
                                    setValue={setNotepadValue}
                                    proxyUploadUrl={proxyUploadUrl}
                                >
                                    <Input.TextArea
                                        rows={20}
                                        value={value}
                                        onChange={(ev) => {
                                            setValue(ev.target.value);
                                        }}
                                    />
                                </DeepgramHandlerPopover>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
            <Footer style={{ textAlign: "center" }}>Deepgram example!</Footer>
        </Layout>
    );
}

export default App;
