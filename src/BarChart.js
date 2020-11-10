import React, { useEffect } from "react";
import Chart from "chart.js";
import "./BarChart.css";

function BarChart({ data, labels, component, displayTitle, titleText }) {
  useEffect(() => {
    const ctxBar = document
      .querySelector(`.barChart${component}__context`)
      .getContext("2d");
    Chart.defaults.global.aspectRatio = false;
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.maintainAspectRatio = false;
    Chart.defaults.global.defaultFontColor = "#4b6584";
    const chartBar = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: false,
            data: data,
            backgroundColor: [
              "rgb(235, 59, 90)",
              "rgb(250, 130, 49)",
              "rgb(32, 191, 107)",
              "rgb(15, 185, 177)",
              "rgb(136, 84, 208)",
              "rgb(75, 101, 132)",
              "rgb(247, 183, 49)",
              "rgb(45, 152, 218)",
              "rgb(38, 222, 129)",
              "rgb(56, 103, 214)",
              "rgb(254, 211, 48)",
              "rgb(43, 203, 186)",
            ],
          },
        ],
      },
      options: {
        title: {
          display: displayTitle,
          text: titleText,
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
    <div className="barChart">
      <canvas className={`barChart${component}__context`}></canvas>
    </div>
  );
}

export default BarChart;
