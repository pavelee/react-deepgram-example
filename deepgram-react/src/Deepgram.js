import { useState } from "react";
import { Form, Input, Popover, Button, Alert, Modal, Spin } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';

export const DeepgramHandler = (props) => {
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

    const applyTranscript = (transcript) => {
        setValue(transcript);
        addAlert("Succesfully applied!");
    };

    const uploadFile = (file) => {
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
            {alerts && alerts.length > 0 && (
                <div>
                    {alerts.map((alert) => (
                        <Alert
                            key={uuidv4()}
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
                    <Spin tip="listening..." />
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
                                applyTranscript(transcript);
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
                {!mediaRecorder && (
                    <span>
                        <RocketOutlined /> let's transcript!
                    </span>
                )}
            </Button>
        </div>
    );
};

export const DeepgramHandlerPopover = (props) => {
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
            <div>{props.children}</div>
        </Popover>
    );
};

export const DeepgramHandlerModal = (props) => {
    const {
        setValue,
        proxyUploadUrl,
        title = "Transcript your voice!",
        visible = false,
        setVisible,
    } = props;

    const onClose = () => setVisible(false);

    return (
        <Modal title={title} visible={visible} onCancel={onClose} footer={null}>
            <DeepgramHandler
                setValue={setValue}
                proxyUploadUrl={proxyUploadUrl}
            />
        </Modal>
    );
};

export const DeepgramHandlerModalButton = (props) => {
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
                <RocketOutlined /> let's transcript!
            </Button>
        </>
    );
};
