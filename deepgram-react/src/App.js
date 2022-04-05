import { Form, Input, Layout, Row, Col } from "antd";
import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import "antd/dist/antd.css";
import { DeepgramHandlerPopover, DeepgramHandlerModalButton } from "./Deepgram";

const { Header, Content, Footer } = Layout;

const FormExample = (props) => {
    const { proxyUploadUrl } = props;
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    return (
        <Form layout="vertical">
            <Form.Item label="Name">
                <DeepgramHandlerPopover
                    proxyUploadUrl={proxyUploadUrl}
                    setValue={setName}
                    placement={'top'}
                >
                    <Input
                        value={name}
                        onChange={(ev) => {
                            setName(ev.target.value);
                        }}
                    />
                </DeepgramHandlerPopover>
            </Form.Item>
            <Form.Item label="Surname">
                <DeepgramHandlerPopover
                    proxyUploadUrl={proxyUploadUrl}
                    setValue={setSurname}
                >
                    <Input
                        value={surname}
                        onChange={(ev) => {
                            setSurname(ev.target.value);
                        }}
                    />
                </DeepgramHandlerPopover>
            </Form.Item>
        </Form>
    );
};

const NotepadExample = (props) => {
    const { proxyUploadUrl } = props;
    const [value, setValue] = useState("");

    const setNotepadValue = (val) => {
        setValue(value + " " + val);
    };

    return (
        <Form name="basic" autoComplete="off" layout="vertical">
            <Form.Item name="note">
                <div
                    style={{
                        textAlign: "left",
                        marginBottom: 15,
                    }}
                >
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
    );
};

function App() {
    const proxyUploadUrl = "http://localhost:8080/audiotranscript";

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
                        <h2>Fill the Form!</h2>
                        <p>
                            Speed up form filling with your voice! Give a  try!
                        </p>
                        <FormExample proxyUploadUrl={proxyUploadUrl} />
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={12}>
                        <h2>Notepad!</h2>
                        <p>
                            Use deepgram to take fast notes about anything! On
                            any device!
                        </p>
                        <NotepadExample proxyUploadUrl={proxyUploadUrl} />
                    </Col>
                </Row>
            </Content>
            <Footer style={{ textAlign: "center" }}>Deepgram example!</Footer>
        </Layout>
    );
}

export default App;
