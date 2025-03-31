import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// contexts
import SettingsProvider from "./contexts/SettingsContext";
import { verifyToken } from "./redux/slices/authSlice";

// ✅ Component to verify token before rendering the app
const InitApp = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(verifyToken());  // Verify token when the app loads
    }, [dispatch]);

    return <App />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

    <HelmetProvider>
      <ReduxProvider store={store}>
        <SettingsProvider>
          <BrowserRouter>
            <InitApp />   {/* 🔥 Now this verifies token before rendering App */}
          </BrowserRouter>
        </SettingsProvider>
      </ReduxProvider>
    </HelmetProvider>
 
);

reportWebVitals();
