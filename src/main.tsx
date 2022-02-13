import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes as Switch,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./assets/style/index.scss";
import Loader from "./components/Loader/Loader";
import routes from "./routes/routes";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (loading) return <Loader />;

  return (
    <>
      <Switch>
        {routes.map((r) => {
          return <Route key={r.path} path={r.path} element={<r.component />} />;
        })}
        <Route path="*" element={<Navigate to="/" />} />
      </Switch>
      <ToastContainer theme="dark" />
    </>
  );
};

ReactDOM.render(
  <RecoilRoot>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>,
  document.getElementById("root")
);
