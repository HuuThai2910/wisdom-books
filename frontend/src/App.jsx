import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div style={{ backgroundColor: "#fafafa", height: "100vh", display: "flex", alignItems: "center" }}>
                <div style={{background: "white", width: "100%", boxShadow: "0 0.8rem 2.4rem 0 rgba(149, 157, 165, 0.2)"}}>
                    <a href="https://vite.dev" target="_blank">
                        <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img
                            src={reactLogo}
                            className="logo react"
                            alt="React logo"
                        />
                    </a>
                </div>
                
            </div>
        </>
    );
}

export default App;
