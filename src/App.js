import React, { useEffect, useState } from "react";
import "./App.css";
import Conversion from "./Conversion";
import Currency from "./Currency";
import Home from "./Home";
import Navbar from "./Navbar";
import Base from "./Base";

function App() {
  const [base, setBase] = useState("EUR");
  const [currencies, setCurrencies] = useState([]);
  const [search, setSearch] = useState("");
  const [baseProgress, setBaseProgress] = useState(0);
  const [latestRates, setLatestRates] = useState({});
  const [allDataLine, setAllDataLine] = useState([]);
  const [labelsLine, setLabelsLine] = useState([]);
  const [dataFailure, setDataFailure] = useState(false);
  const [conversionActive, setConversionActive] = useState(false);
  const [canConversionClose, setCanConversionClose] = useState(true);

  // show and hide the currencies box
  const [boxActive, setBoxActive] = useState(false);
  const [didMouseLeave, setMouseLeave] = useState(true);
  const [mouseDownIn, setMouseDownIn] = useState(false);

  useEffect(() => {
    console.log("currencies => ", currencies);
    console.log("fetch data => ", latestRates);
    console.log("all data line => ", allDataLine);
    console.log("labels line => ", labelsLine);
  }, [currencies, latestRates, allDataLine, labelsLine]);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key == "Escape") {
        setConversionActive(false);
        setBoxActive(false);
        setSearch("");
      }
    });
  }, []);

  useEffect(() => {
    if (boxActive) {
      document.querySelector(".base__currenciesSearch").focus();
    } else if (conversionActive) {
      document.querySelector(".conversion__amount input").focus();
    }
  }, [boxActive, conversionActive]);

  const showCurrencies = () => {
    setBoxActive(!boxActive);
  };
  const closeCurrencies = (event) => {
    const currencies = [...document.querySelectorAll(".base__currency")];
    const showCurrencies = document.querySelector(".app__baseCurrency");

    if (event.type == "mousedown" && currencies.includes(event.target)) {
      pickCurrency(event);
    }

    if (
      event.type == "mouseup" &&
      didMouseLeave &&
      event.target != showCurrencies
    ) {
      if (!mouseDownIn) {
        setSearch("");
        setBoxActive(false);
      } else {
        setMouseDownIn(false);
      }
    }
  };

  const closeConversion = (event) => {
    if (event.target != document.querySelector('a[data-name="conversion"]')) {
      if (canConversionClose) {
        setConversionActive(false);
      }
    }
  };

  const pickCurrency = (event) => {
    setBoxActive(false);
    setBase(event.target.textContent);
    setBaseProgress(baseProgress + 1);
  };

  const toggleNav = (event) => {
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("navbar--active");
    const toggleNav = document.querySelector(".app__toggleNav");
    toggleNav.classList.toggle("app__toggleNav--active");
  };

  return (
    <div
      className="app"
      onMouseUp={closeCurrencies}
      onMouseDown={closeCurrencies}
      onClick={closeConversion}
    >
      {!dataFailure ? (
        <>
          <Navbar
            toggleNav={toggleNav}
            conversionActive={conversionActive}
            setConversionActive={setConversionActive}
          />
          <div className="app__toggleNav" onClick={toggleNav}>
            <span>&#8595;</span>
          </div>
          <div className="app__header">
            <h1 className="app__headerLogo">Welcome To All About Currency</h1>
            <h1 className="app__headerBaseMessage">
              Base Currency Is &nbsp;
              <span
                className="app__baseCurrency"
                onClick={showCurrencies}
                title="Change The Base"
              >
                {" "}
                {base} &#9776;
              </span>
            </h1>
          </div>

          <Base
            setBase={setBase}
            boxActive={boxActive}
            setBoxActive={setBoxActive}
            currencies={currencies}
            baseProgress={baseProgress}
            setBaseProgress={setBaseProgress}
            search={search}
            setSearch={setSearch}
            setMouseLeave={setMouseLeave}
            setMouseDownIn={setMouseDownIn}
          />
          <Conversion
            currencies={currencies}
            latestRates={latestRates}
            conversionActive={conversionActive}
            setConversionActive={setConversionActive}
            setCanConversionClose={setCanConversionClose}
          />
          <div className="app__content">
            <Home
              base={base}
              setCurrencies={setCurrencies}
              baseProgress={baseProgress}
              latestRates={latestRates}
              setLatestRates={setLatestRates}
              allDataLine={allDataLine}
              setAllDataLine={setAllDataLine}
              labelsLine={labelsLine}
              setLabelsLine={setLabelsLine}
              setDataFailure={setDataFailure}
            />
            <Currency
              base={base}
              baseProgress={baseProgress}
              setBaseProgress={setBaseProgress}
              latestRates={latestRates}
              labelsLine={labelsLine}
              allDataLine={allDataLine}
              setDataFailure={setDataFailure}
              dataFailure={dataFailure}
            />
          </div>
        </>
      ) : (
        <h1 className="app__failure">
          Sorry!. There must be some error in the application. We will try to
          fix it as soon as possible.
        </h1>
      )}
    </div>
  );
}

export default App;
