import React from 'react';
import sta from "../assets/big-sta.png"
const bg=require('../assets/icon-back.png')

export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(){
    return <div className="menu">
      <img src={sta} className="big-logo" alt="img"/>
    </div>
  }
}