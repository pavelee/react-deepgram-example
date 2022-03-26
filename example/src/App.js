import logo from "./logo.svg";
import "./App.css";
import React from "react";

const DeepgramHandler = (props) => {
    return <>{props.children}</>;
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
                    <button>transcript!</button>
                </p>
            </header>
        </div>
    );
}

const styles = React.createS;

export default App;
