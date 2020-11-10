import React, { useEffect, useState } from "react";
import "./Home.css";
import LineChar from "./LineChart";
import BarChart from "./BarChart";
import { fixerKey } from "./api";
import Loading from "./Loading";

function Home({
  base,
  setCurrencies,
  baseProgress,
  latestRates,
  setLatestRates,
  allDataLine,
  setAllDataLine,
  labelsLine,
  setLabelsLine,
  setDataFailure,
}) {
  const [dataBar, setDataBar] = useState([]);
  const [labelsBar, setLabelsBar] = useState([]);
  const [dataSetsLine, setDataSetsLine] = useState([]);
  const [chartProgress, setChartProgress] = useState(0);
  const [dataBar2, setDataBar2] = useState([]);
  const [dataSetsLine2, setDataSetsLine2] = useState([]);

  useEffect(() => {
    let unmounted = false;
    const labels = [];
    const displayCurrencies = ["GBP", "AUD", "CAD", "CHF", "NZD", "USD"];
    const borderColors = [
      "rgb(235, 59, 90)",
      "rgb(250, 130, 49)",
      "rgb(32, 191, 107)",
      "rgb(15, 185, 177)",
      "rgb(136, 84, 208)",
      "rgb(75, 101, 132)",
    ];

    const allData = [];

    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month.toString().length == 2 ? month : `0${month}`;
    let day = date.getDate() - 1;
    day = day.toString().length == 2 ? day : `0${day}`;

    for (let x = 0; x < 8; x++) {
      fetch(
        `http://data.fixer.io/api/${
          year - 7 + x + "-" + month + "-" + day
        }?access_key=${fixerKey}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(response);
        })
        .then((data) => {
          if (data.success) {
            labels.push(year - 7 + x);
            allData.push(data);

            if (x == 7) {
              allData.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
              labels.sort((a, b) => (a > b ? 1 : -1));

              const barData = [];

              displayCurrencies.forEach((element) =>
                barData.push(data.rates[element])
              );

              let chartData = allData.map((element, index) => {
                return {
                  label: displayCurrencies[index],
                  borderColor: borderColors[index],
                  data: allData.map(
                    (element) => element.rates[displayCurrencies[index]]
                  ),
                };
              });

              chartData.pop();
              chartData.pop();
              if (!unmounted) {
                setLatestRates(data);
                setCurrencies(Object.keys(data.rates));
                setLabelsBar(displayCurrencies);
                setDataBar(barData);
                setAllDataLine(allData);
                setDataSetsLine(chartData);
                setLabelsLine(labels);
                setChartProgress(1);
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
  }, []);

  useEffect(() => {
    let unmounted = false;
    if (allDataLine.length > 0) {
      if (baseProgress != 0) {
        // bar
        const baseEqualCurrencyBar = labelsBar.findIndex(
          (element) => element == base
        );
        const newBaseValue = 1 / latestRates.rates[base];
        if (!unmounted) {
          setDataBar2(
            dataBar.map((element, index) => {
              if (baseEqualCurrencyBar == index) {
                return 1; // because sometimes it goes 0.9999999
              }
              return element * newBaseValue;
            })
          );
        }

        // line
        const newBaseValues = [];
        const baseEqualCurrencyLine = dataSetsLine.findIndex(
          (element) => element.label == base
        );

        allDataLine.forEach((element) => {
          newBaseValues.push(1 / element.rates[base]);
        });

        if (!unmounted) {
          setDataSetsLine2(
            dataSetsLine.map((element, index) => {
              if (baseEqualCurrencyLine == index)
                return {
                  ...element,
                  data: element.data.map((element) => element * 0 + 1),
                };
              // because sometimes it goes 0.9999999
              else
                return {
                  ...element,
                  data: element.data.map(
                    (element, index) => element * newBaseValues[index]
                  ),
                };
            })
          );
        }

        ///////
        if (!unmounted) {
          setChartProgress(0);
          setTimeout(() => {
            setChartProgress(2);
          }, 0.000000000001);
        }
      }
    }
  }, [baseProgress]);

  return (
    <div className="home slide on">
      <div className="home__charts">
        {/* {chartProgress == 1 ? (
          <BarChartHome data={dataBar} labels={labelsBar} />
        ) : (
          ""
        )} */}
        {chartProgress == 2 ? (
          <BarChart component="Home" data={dataBar2} labels={labelsBar} />
        ) : (
          <Loading component="home" />
        )}
        {/* {chartProgress == 1 ? (
          <LineChartHome dataSets={dataSetsLine} labels={labelsLine} />
        ) : (
          ""
        )} */}
        {chartProgress == 2 ? (
          <LineChar
            displayLegend={true}
            component="Home"
            dataSets={dataSetsLine2}
            labels={labelsLine}
          />
        ) : (
          <Loading component="home" />
        )}
      </div>
    </div>
  );
}

export default Home;
