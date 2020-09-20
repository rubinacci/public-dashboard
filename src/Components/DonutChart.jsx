import React from "react";
import ReactApexChart from 'react-apexcharts'

export class DonutChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
        series: [44, 55, 41],
        options: {
            chart: {
            type: 'donut',
            },
            responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                width: 200
                },
                legend: {
                position: 'bottom'
                }
            }
            }]
        },
    }
    
  }
  render() {
    return (<div id="chart">
      <div className="chart-div-container">
        <ReactApexChart 
          options={this.state.options} 
          series={this.state.series} 
          type="donut" 
          height={360} 
          width={360}        
        />
        </div>
      </div>
    );
  }
}

    