import React from "react";
import "./Options.css";

function Options({ currencies, value, setValue, classname }) {
  return (
    <select
      className={`options ${classname}`}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    >
      {currencies.length > 0
        ? currencies.map((element) => (
            <option
              key={
                new Date().getUTCMilliseconds() * Math.random() +
                Math.random() -
                Math.random()
              }
              value={element}
            >
              {element}
            </option>
          ))
        : ""}
    </select>
  );
}

export default Options;
