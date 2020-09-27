import {AreaChart} from './AreaChart'
import {BarChart} from './BarChart'
import {DonutChart} from './DonutChart'
import React from 'react';
import axios from 'axios';

export class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentWillMount(){  
    this.getDataFetch('http://statera-dashboard-staging.herokuapp.com/api/chartdata')    
  }
  async getDataAxios(url){
    const response = await axios.get(url)
    console.log(response.data)
  }
  async getDataFetch(url){
    const response =
      await fetch(url,
        { headers: {'Content-Type': 'application/json'}}
      )
    console.log(await response)
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