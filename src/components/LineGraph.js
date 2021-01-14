import React, { Component } from "react";
import { Line } from "react-chartjs-2";


export default class LineDemo extends Component {
  render() {
    const data = {
      labels: this.props.labels,
      datasets: [
        {
          label: this.props.label,
          fill: true,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          data: this.props.data
        }
      ]
    };
    return <Line ref="chart" data={data} />;
  }

  componentDidMount() {
    const { datasets } = this.refs.chart.chartInstance.data;
    console.log(datasets[0].data);
  }
}
