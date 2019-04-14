import React from "react";
import Router from "@/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/assets/scss/styles.scss";

const App = () => {
  return (
    <div>
      <ToastContainer autoClose={3000} />
      <Router />
    </div>
  );
};

export default App;
