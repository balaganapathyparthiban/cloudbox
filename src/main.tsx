import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import "./assets/style/index.scss";
import Loader from "./components/Loader/Loader";
import routes from "./routes/routes";
import { LocaleContext } from "./store/store";

const App: React.FC = () => {
  const [locale, setLocale] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("gun/")) {
      localStorage.removeItem("gun/");
    }
    fetchLocale();
  }, []);

  const fetchLocale = async () => {
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/balaganapathyparthiban/cloudbox/master/public/locales/en.json"
      );
      setLocale(response.data);
    } catch {
      const response = await axios.get("/locales/en.json");
      setLocale(response.data);
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <LocaleContext.Provider value={locale}>
      <Switch>
        {routes.map((r) => {
          return <Route key={r.path} path={r.path} element={<r.component />} />;
        })}
        <Route path="*" element={<Navigate to="/" />} />
      </Switch>
      <ToastContainer theme="dark" />
    </LocaleContext.Provider>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
