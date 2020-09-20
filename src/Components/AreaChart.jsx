import {ChartButtons} from './ChartButtons'
import React from "react";
import ReactApexChart from 'react-apexcharts'

export class AreaChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }],
      options: {
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        yaxis: { show: false },
        xaxis: {
          labels: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth'
        },              
        floating: true,
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        },
        labels: {
          show: false
        },              
      },
    
    
    };
  }
  render() {
    return (<div id="chart">
      <div className="chart-div-container">
        <div className="apex-chart-container">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="area" 
            height={200} 
            width={390}   
          />
        </div>
        <ChartButtons/>
        </div>
      </div>
    );
  }
}

    