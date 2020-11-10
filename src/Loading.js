import React from "react";
import "./Loading.css";

function Loading({ component }) {
  return (
    <h1 className={`loading__${component}`}>
      Loading <span className="loading__arrow">&#8634;</span>
    </h1>
  );
}

export default Loading;
