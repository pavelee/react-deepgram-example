import { useState } from "react";
import { Form, Input, Popover, Button, Alert, Modal, Spin, Select } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const languages = [
    {
        label: "English",
        value: "en",
    },
    {
        label: "Chinese",
        value: "zh-CN",
    },
    {
        label: "Dutch",
        value: "nl",
    },
    {
        label: "French",
        value: "fr",
    },
    {
        label: "German",
        value: "de",
    },
    {
        label: "Hindi",
        value: "hi",
    },
    {
        label: "Indonesian",
        value: "id",
    },
    {
        label: "Italian",
        value: "it",
    },
    {
        label: "Korean",
        value: "ko",
    },
    {
        label: "Portuguese",
        value: "pt",
    },
    {
        label: "Russian",
        value: "ru",
    },
    {
        label: "Spanish",
        value: "sv",
    },
    {
        label: "Turkish",
        value: "tr",
    },
    {
        label: "Ukrainian",
        value: "uk",
    },
];

export const DeepgramHandler = (props) => {
    const {
        setValue,
        proxyUploadUrl,
        maxWidth,
        emptyTranscriptionWarningMessage = "Empty transcription! Repeat again, please!",
        listenEventMessage = "listening...",
        transcriptingEventMessage = "using deebgram AI to transcript...",
        stopMessage = "stop!",
        transcriptMessage = "let's transcript!",
        appliedMessage = "Succesfully applied!",
        defaultLanguage = "en",
    } = props;
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [transcript, setTranscript] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [fetchingTranscript, setFetchingTranscript] = useState(false);
    const [language, setLanguage] = useState(defaultLanguage);

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
        addAlert(appliedMessage);
    };

    const uploadFile = (file, language = defaultLanguage) => {
        const API_ENDPOINT = proxyUploadUrl;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);

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
                    addAlert(emptyTranscriptionWarningMessage, "warning");
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
                uploadFile(audioBlob, language);
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
                    <Spin tip={listenEventMessage} />
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
                    <Spin tip={transcriptingEventMessage} />
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
            <div style={{ marginBottom: 15 }}>
                <Select
                    value={language}
                    onChange={(val) => {
                        setLanguage(val);
                    }}
                    style={{ width: "100%" }}
                >
                    {languages.map((language) => (
                        <Select.Option
                            key={language.value}
                            value={language.value}
                        >
                            {language.label}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            <Button
                onClick={() => {
                    mediaRecorder ? stopRecord(mediaRecorder) : startRecord();
                }}
                type={mediaRecorder ? "danger" : "primary"}
                block
                loading={fetchingTranscript}
            >
                {mediaRecorder && <span>{stopMessage}</span>}
                {!mediaRecorder && (
                    <span>
                        <RocketOutlined /> {transcriptMessage}
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
        title = "Fill with your voice!",
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

export const DeepgramHandlerModal = (props) => {
    const {
        setValue,
        proxyUploadUrl,
        title = "Fill with your voice!",
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
        title = "Fill with your voice!",
        buttonText = "let's transcript!",
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
                <RocketOutlined /> {buttonText}
            </Button>
        </>
    );
};
