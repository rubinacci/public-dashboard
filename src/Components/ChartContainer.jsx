import {
    VictoryBar,
    VictoryChart,
} from "victory";

import {AreaChart} from './AreaChart'
import {BarChart} from './BarChart'
import {DonutChart} from './DonutChart'
import React from 'react';

export class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render(){
    return <div className="chart-container">
        <div className="area-charts">
            <AreaChart/>
            <AreaChart/>
            <AreaChart/>
            <DonutChart/>            
        </div>
        <div className="area-charts">
            <BarChart/>
            <BarChart/>
            <BarChart/>
            <BarChart/>           
        </div>
    </div>
  }
}