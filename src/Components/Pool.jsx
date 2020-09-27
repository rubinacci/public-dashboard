import {AreaChart} from './AreaChart'
import {BarChart} from './BarChart'
import {CustomTable} from "./CustomTable"
import React from 'react';

export class Pool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return <div className="pool-container">
      <div className="pool-data-container">
        <AreaChart/>
        <BarChart/>
      </div>  
      <div className="table-container">
          <CustomTable/>
      </div>
      <div className="pool-data-container">
        <AreaChart/>
        <BarChart/>
      </div>  
    </div>
  }
}