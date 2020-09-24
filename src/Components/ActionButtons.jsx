import Button from '@material-ui/core/Button';
import React from 'react';

export class ActionButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(){
    return <div className="action-buttons-container">
        <div className="action-buttons-card">
          <div className="trade-text-header">Transactions</div>
          <div className="trade-text">Trade</div>
          <div className="trade-div">
            <Button className="trade-button" onClick={() => console.log("hello")}> BUY STATERA</Button>
            <Button className="trade-button" onClick={() => console.log("hello")}> SELL STATERA</Button>
          </div>
          <div className="trade-text">Liquidity Pool</div>
          <div className="trade-div">
            <Button className="liquidity-button" onClick={() => console.log("hello")}>ADD LIQUIDITY</Button>
            <Button className="liquidity-button" onClick={() => console.log("hello")}>REMOVE LIQUIDITY</Button>
          </div>
        </div>
        <div className="action-buttons-card">
          <div className="trade-text-header">Transactions</div>
          <div className="trade-text">Trade</div>
          <div className="trade-div">
            <Button className="trade-button" onClick={() => console.log("hello")}> BUY STATERA</Button>
            <Button className="trade-button" onClick={() => console.log("hello")}> SELL STATERA</Button>
          </div>
          <div className="trade-text">Liquidity Pool</div>
          <div className="trade-div">
            <Button className="liquidity-button" onClick={() => console.log("hello")}>ADD LIQUIDITY</Button>
            <Button className="liquidity-button" onClick={() => console.log("hello")}>REMOVE LIQUIDITY</Button>
          </div>
        </div>
        <div className="action-buttons-card">
          <div className="trade-text-header">Transactions</div>
          <div className="trade-text">Trade</div>
          <div className="trade-div">
            <Button className="trade-button" onClick={() => console.log("hello")}> BUY STATERA</Button>
            <Button className="trade-button" onClick={() => console.log("hello")}> SELL STATERA</Button>
          </div>
          <div className="trade-text">Liquidity Pool</div>
          <div className="trade-div">
            <Button className="liquidity-button" onClick={() => console.log("hello")}>ADD LIQUIDITY</Button>
            <Button className="liquidity-button" onClick={() => console.log("hello")}>REMOVE LIQUIDITY</Button>
          </div>
        </div>
        <div className="action-buttons-card">
        </div>
    </div>
  }
}