import React, { useEffect, useState } from "react";
import "./Base.css";

function Base({
  setBase,
  boxActive,
  setBoxActive,
  currencies,
  baseProgress,
  setBaseProgress,
  search,
  setSearch,
  setMouseLeave,
  setMouseDownIn,
}) {
  const enterBase = (event) => {
    const isIncluded = currencies.includes(search.toUpperCase());
    if (event.key == "Enter" && isIncluded) {
      setBase(search.toUpperCase());
      setBaseProgress(baseProgress + 1);
      setBoxActive(false);
      setSearch("");
    }
  };
  // show and hide the currencies box , it is also on the top but here are the specific parts

  const handleMouseLeave = (event) => {
    setMouseLeave(true);
  };

  const handleMouseEnter = (event) => {
    setMouseLeave(false);
  };

  const handleMouseDown = (event) => {
    setMouseDownIn(true);
  };

  return (
    <div
      className="base"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`base__currencies ${
          boxActive ? "base__currencies--active" : ""
        }`}
      >
        <input
          type="text"
          placeholder="Enter Base Currency"
          className="base__currenciesSearch"
          value={search}
          onKeyDown={enterBase}
          onChange={(e) => setSearch(e.target.value)}
        />
        {currencies.map((currency) => {
          if (
            currency.includes(search.toLowerCase()) ||
            currency.includes(search.toUpperCase())
          ) {
            return (
              <span
                key={
                  new Date().getUTCMilliseconds() * Math.random() +
                  Math.random() -
                  Math.random()
                }
                className="base__currency"
              >
                {currency}
              </span>
            );
          } else return "";
        })}
      </div>
    </div>
  );
}

export default Base;
