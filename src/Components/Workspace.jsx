import {ActionButtons} from "./ActionButtons"
import {ChartContainer} from "./ChartContainer"
import {Menu} from "./Menu"
import React from 'react';
import {TopData} from "./TopData"

export class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(){
    return  <div className="app-body">  
              <Menu/>
              <div className="data-div">
                <TopData/>       
                <ChartContainer/>   
                <ActionButtons/>       
              </div>           
            </div>
  }
}