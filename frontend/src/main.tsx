import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { BrowserRouter } from "react-router-dom";
import { BookProvider } from "./contexts/BookContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BookProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BookProvider>
    </Provider>
  </StrictMode>
);
