import React from "react";
import { Chart } from "react-google-charts";

function BasicPie({ videoResult, title }) {

  // const options = {
  //   title: "The video's genre distribution using the trending videos",
  //   backgroundColor: "transparent", // Making the background transparent
  //   titleTextStyle: {
  //     color: "cyan", // Setting title text color to cyan
  //   },
  //   legend: {
  //     textStyle: {
  //       color: "cyan", // Setting legend text color to cyan
  //     },
  //   },
  // };

  const options = {
    title: title,
    backgroundColor: "transparent",
    titleTextStyle: {
      color: "cyan",
    },
    legend: {
      textStyle: {
        color: "cyan",
      },
    },
  };

  let data = [
    ["Genre", "Percentage found"]
  ];

  // const data = [
  //   ["Task", "Hours per Day"],
  //   ["Work", 11],
  //   ["Eat", 2],
  //   ["Commute", 2],
  //   ["Watch TV", 2],
  //   ["Sleep", 7],
  // ];

  console.log(videoResult);
  console.log(title);

  Object.keys(videoResult).map((key) => {
    const genre = videoResult[key];
    data.push([key, genre.percentage])
  })

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
}

export default BasicPie;
