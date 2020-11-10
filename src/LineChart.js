import React, { useEffect } from "react";
import Chart from "chart.js";
import "./LineChart.css";

function LineChartHome({
  dataSets,
  labels,
  component,
  displayTitle,
  titleText,
  displayLegend,
}) {
  useEffect(() => {
    const ctxLine = document
      .querySelector(`.lineChart${component}__context`)
      .getContext("2d");
    Chart.defaults.global.elements.line.fill = false;
    Chart.defaults.global.elements.line.tension = 0.2;

    const chartLine = new Chart(ctxLine, {
      type: "line",

      data: {
        labels: labels,
        datasets: dataSets,
      },
      options: {
        title: {
          display: displayTitle,
          text: titleText,
        },
        legend: {
          display: displayLegend,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }, []);

  return (
    <div className="lineChart">
      <canvas className={`lineChart${component}__context`}></canvas>
    </div>
  );
}

export default LineChartHome;
