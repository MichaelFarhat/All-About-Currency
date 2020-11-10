import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";
import "./Currency.css";
import Options from "./Options";
import { fixerKey } from "./api";
import LineChart from "./LineChart";
import Loading from "./Loading";

function Currency({
  base,
  baseProgress,
  setBaseProgress,
  latestRates,
  allDataLine,
  labelsLine,
  setDataFailure,
}) {
  const [labelsBar, setLabelsBar] = useState([]);
  const [dataBar, setDataBar] = useState([]);
  const [dataBar2, setDataBar2] = useState([]);
  const [dataSetsLine, setDataSetsLine] = useState([]);
  const [dataSetsLine2, setDataSetsLine2] = useState([]);
  const [pickedCurrency, setPickedCurrency] = useState("AED");
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [progress, setProgress] = useState("");
  const [allRates, setAllRates] = useState([]);

  useEffect(() => {
    let unmounted = false;
    if (latestRates.rates) {
      if (!unmounted) {
        setAllCurrencies(Object.keys(latestRates.rates));
      }
    }
    return () => {
      unmounted = true;
    };
  }, [latestRates]);

  useEffect(() => {
    let unmounted = false;
    const labels = [];
    let data = [];
    const allData = [];

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let day = date.getDate() - 1; // for api issues
    day = day.toString().length == 2 ? day : `0${day}`;

    for (let x = 1; x <= 12; x++) {
      if (x > month) break;
      fetch(
        `http://data.fixer.io/api/${
          year + "-" + (x < 10 ? "0" + x : x.toString()) + "-" + day
        }?access_key=${fixerKey}&symbols=`
      )
        .then((response) => {
          if (response.ok) return response.json();
          return Promise.reject(response);
        })
        .then((resData) => {
          if (resData.success) {
            allData.push(resData);
            labels.push(resData.date);
            data.push(resData.rates[pickedCurrency]);
            if (!unmounted) {
              if (x + 1 > month) {
                setLabelsBar(labels);
                setDataBar(data);
                setAllRates(allData);
                setBaseProgress(baseProgress + 1);
              }
            }
          } else {
            if (!unmounted) {
              setDataFailure(true);
            }
          }
        })
        .catch((error) => {
          if (!unmounted) {
            setDataFailure(true);
          }
        });
    }

    return () => {
      unmounted = true;
    };
  }, [pickedCurrency]);

  useEffect(() => {
    let unmounted = false;
    if (allDataLine.length > 0) {
      const lineData = [
        {
          label: pickedCurrency,
          borderColor: "rgb(75, 101, 132)",
          data: allDataLine.map((element) => element.rates[pickedCurrency]),
        },
      ];

      if (!unmounted) {
        setDataSetsLine(lineData);
      }
    }
    return () => {
      unmounted = true;
    };
  }, [allDataLine, pickedCurrency]);

  useEffect(() => {
    let unmounted = false;
    if (allDataLine.length > 0) {
      if (baseProgress != 0) {
        // bar
        const newBaseValuesBar = [];
        allRates.forEach((element) => {
          newBaseValuesBar.push(1 / element.rates[base]);
        });
        if (!unmounted) {
          setDataBar2(
            dataBar.map((element, index) => {
              if (base == pickedCurrency) return element * 0 + 1;
              // becuase sometimes it goes 0.9999999 ⤴
              else return element * newBaseValuesBar[index];
            })
          );
        }

        // line

        const newBaseValuesLine = [];

        allDataLine.forEach((element) => {
          newBaseValuesLine.push(1 / element.rates[base]);
        });

        if (!unmounted) {
          setDataSetsLine2(
            dataSetsLine.map((element) => {
              if (base == pickedCurrency)
                return {
                  ...element,
                  data: element.data.map((element) => element * 0 + 1),
                };
              else
                return {
                  ...element,
                  data: element.data.map(
                    (element, index) => element * newBaseValuesLine[index]
                  ),
                };
            })
          );
        }
        if (!unmounted) {
          setProgress(0);
          setTimeout(() => {
            setProgress(1);
          }, 0.000000000001);
        }
      }
    }

    return () => {
      unmounted = true;
    };
  }, [baseProgress]);

  return (
    <div className="currency slide">
      {progress == 1 ? (
        <>
          <div className="currency__header">
            <div className="currency__headerOptions">
              <label>Change The Currency</label>
              <Options
                classname="currency__headerOptionsMenu"
                value={pickedCurrency}
                setValue={setPickedCurrency}
                currencies={allCurrencies}
              />
            </div>

            <h1 className="currency__headerMessage">
              1 <span className="currency__headerMessageBase">{base}</span> ={" "}
              {dataBar2[dataBar2.length - 1]}{" "}
              <span className="currency__headerMessagePicked">
                {pickedCurrency}
              </span>
            </h1>
          </div>
          <div className="currency__charts">
            <BarChart
              labels={labelsBar}
              data={dataBar2}
              component="Currency"
              displayTitle={true}
              titleText="Rates Of This Year"
            />
            <LineChart
              displayTitle={true}
              titleText="Rates Of The Last 7 Years"
              component="Currency"
              labels={labelsLine}
              dataSets={dataSetsLine2}
            />
          </div>
        </>
      ) : (
        <Loading component="currency" />
      )}
    </div>
  );
}

export default Currency;
