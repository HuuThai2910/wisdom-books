import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header.js";
import Footer from "./components/Footer/Footer.js";
import { BookProvider } from "./contexts/BookContext";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <Provider store={store}>
            <BookProvider>
                <BrowserRouter>
                    {/* <Header /> */}
                    <App />
                    <Footer />
                </BrowserRouter>
            </BookProvider>
        </Provider>
    // </StrictMode>
);
