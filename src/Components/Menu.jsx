import Button from '@material-ui/core/Button';
import React from 'react';
import sta from "../assets/big-sta.png"

export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setClickedPool(pool){
    this.setState({clickedPool: pool})
    this.props.setSelectedPool(pool)
  }
  render(){
    return <div className="menu">
      <img src={sta} className="big-logo" alt="img"/>
      <Button className="connect-button" onClick={() => console.log("hello")}>Connect Wallet</Button>
      <div class="menu-buttons">
        <div className="dashboards-div" onClick={()=>this.setClickedPool("")}>Dashboard</div>
        <div className="pool-div-container">
          <div className={this.state.clickedPool === "sta"? "pool-div selected-pool-div" :"pool-div"} onClick={()=>this.setClickedPool("sta")}>&nbsp;&nbsp;Statera</div>
          <div className={this.state.clickedPool === "delta"? "pool-div selected-pool-div" :"pool-div"} onClick={()=>this.setClickedPool("delta")}>&nbsp;&nbsp;Delta</div>
          <div className={this.state.clickedPool === "phoenix"? "pool-div selected-pool-div" :"pool-div"} onClick={()=>this.setClickedPool("phoenix")}>&nbsp;&nbsp;Phoenix Fund</div>
        </div>
      </div>
    </div>
  }
}