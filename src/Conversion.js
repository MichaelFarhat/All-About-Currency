import React, { useEffect, useState } from "react";
import "./Conversion.css";
import Options from "./Options";

function Conversion({
  currencies,
  latestRates,
  conversionActive,
  setCanConversionClose,
}) {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState(0);
  useEffect(() => {
    if (conversionActive) {
      if (latestRates.rates) {
        const fromAmount = 1 / latestRates.rates[from];
        const toAmount = latestRates.rates[to];
        const result = fromAmount * amount * toAmount;
        const userMessage = amount == 0 ? 0 : result;
        setResult(userMessage);
      }
    }
  }, [amount, to, from]);

  useEffect(() => {
    if (!conversionActive) {
      setAmount(0);
      setResult(0);
    }
  }, [conversionActive]);

  const handleConversionClose = (event) => {
    if (event.type == "mouseleave") {
      setCanConversionClose(true);
    }
    if (event.type == "mouseenter") {
      setCanConversionClose(false);
    }
  };

  return (
    <div
      onMouseLeave={handleConversionClose}
      onMouseEnter={handleConversionClose}
      className={`conversion ${conversionActive ? "conversion--active" : ""}`}
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="conversion__from">
          <label>From </label>
          <Options value={from} setValue={setFrom} currencies={currencies} />
        </div>
        <div className="conversion__amount">
          <label>Amount </label>
          <input
            type="text"
            value={amount}
            onChange={(event) => {
              if (Number.isInteger(Number(event.target.value)))
                setAmount(event.target.value);
            }}
          />
        </div>
        <div className="conversion__to">
          <label>To </label>
          <Options value={to} setValue={setTo} currencies={currencies} />
        </div>
      </form>
      <h1 className="conversion__message">{result}</h1>
    </div>
  );
}

export default Conversion;
