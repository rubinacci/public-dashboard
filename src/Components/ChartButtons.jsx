import React from "react";

export class ChartButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {              
    };
  }
  render() {
    return (
        <div className="chart-buttons-container">
          <div className="chart-button">
            24hr
          </div>
          <div className="chart-button">
            Week
          </div>
          <div className="chart-button">
            Month
          </div>
          <div className="chart-button">
            All
          </div>
        </div>
    );
  }
}

    