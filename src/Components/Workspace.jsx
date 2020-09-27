import {ActionButtons} from "./ActionButtons"
import {ChartContainer} from "./ChartContainer"
import {Menu} from "./Menu"
import {Pool} from "./Pool"
import React from 'react';
import {TopData} from "./TopData"

export class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setSelectedPool = (pool) => {
    console.log(pool)
    this.setState({selectedPool: pool})
  }
  render(){
    console.log(this.state.selectedPool, this.state)
    return  <div className="app-body">  
              <Menu setSelectedPool={this.setSelectedPool}/>
              <div className="data-div">
                <TopData/>
                { this.state.selectedPool 
                  ? <><Pool/></>
                  :<>
                    <ChartContainer/>   
                    <ActionButtons/> 
                  </>

                }                          
              </div>           
            </div>
  }
}