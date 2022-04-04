import {
    Form,
    Input,
    Popover,
    Button,
    Alert,
    Modal,
    Steps,
    Checkbox,
} from "antd";
import { Layout, Menu, Row, Col, Spin } from "antd";
import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";

const { Header, Content, Footer } = Layout;

const DeepgramHandler = (props) => {
    const { setValue, proxyUploadUrl, maxWidth } = props;
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [transcript, setTranscript] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [fetchingTranscript, setFetchingTranscript] = useState(false);

    const clearAlerts = () => {
        setAlerts([]);
    };

    const addAlert = (message, type = "success", showIcon = true) => {
        setAlerts([
            ...alerts,
            {
                type,
                message,
                showIcon,
            },
        ]);
    };

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
                console.log(res);
                if (res.transcript) {
                    setTranscript(res.transcript);
                } else {
                    addAlert(
                        "Empty transcription! Repeat again, please!",
                        "warning"
                    );
                }
                setFetchingTranscript(false);
            })
            .catch((err) => {
                addAlert(err, "error");
                setFetchingTranscript(false);
            });
    };

    const startRecord = () => {
        clearAlerts();
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
        <div style={{ maxWidth: maxWidth ? maxWidth : "auto" }}>
            {/* <div>
                <Steps size="small" current={1}>
                    <Steps.Step title="Record" />
                    <Steps.Step title="transcript with AI" />
                </Steps>
            </div> */}
            {alerts && alerts.length > 0 && (
                <div>
                    {alerts.map((alert) => (
                        <Alert
                            style={{ marginBottom: 15 }}
                            message={alert.message}
                            type={alert.type}
                            showIcon={alert.showIcon}
                        />
                    ))}
                </div>
            )}
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
                <Form layout={"vertical"}>
                    <Form.Item label={"transcription"}>
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
                maxWidth={300}
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

const DeepgramHandlerModal = (props) => {
    const {
        setValue,
        proxyUploadUrl,
        title = "Transcript your voice!",
        visible = false,
        setVisible,
    } = props;

    const onClose = () => setVisible(false);

    return (
        <Modal
            title={title}
            visible={visible}
            onCancel={onClose}
            footer={null}
            // onOk={handleOk}
            // onCancel={handleCancel}
        >
            <DeepgramHandler
                setValue={setValue}
                proxyUploadUrl={proxyUploadUrl}
            />
        </Modal>
    );
};

const DeepgramHandlerModalButton = (props) => {
    const {
        setValue,
        proxyUploadUrl,
        buttonProps = {},
        title = "Transcript your voice!",
        defaultVisible = false,
    } = props;
    const [visible, setVisible] = useState(defaultVisible);

    return (
        <>
            <DeepgramHandlerModal
                title={title}
                setValue={setValue}
                proxyUploadUrl={proxyUploadUrl}
                visible={visible}
                setVisible={setVisible}
            />
            <Button {...buttonProps} onClick={() => setVisible(true)}>
                transcript
            </Button>
        </>
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
                            <Form.Item name="note">
                                <div style={{ textAlign: 'left', marginBottom: 15 }}>
                                    <DeepgramHandlerModalButton
                                        setValue={setNotepadValue}
                                        proxyUploadUrl={proxyUploadUrl}
                                        buttonProps={{
                                            type: "primary",
                                        }}
                                    />
                                </div>
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
