import React from 'react';
import delta from "../assets/delta.png"
import sta from "../assets/sta.svg"
const bg=require('../assets/icon-back.png')

export class TopData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(){
    return <div className="top-data">
        <div className="data-container statera-data-gradient">
          <div className="data-top">
            <div className="icon-back" style ={ { backgroundImage: "url("+bg+")" } }>
                <img src={sta} className="logo" alt="img"/>
            </div>
            <div className="data-top-text">Statera</div>
          </div>
          <div className="data-bot">
              <div className="apy-text">%APY</div>
              <div className="apy-data">
                <div>24hr</div>
                <div></div>  
              </div>
              <div className="apy-data">
                <div>1w</div>
                <div></div>
              </div>
              <div className="apy-data">
                <div>1m</div>
                <div></div>
              </div>
              <div className="apy-data">
                <div>1y</div>
                <div></div>
              </div>
          </div>
        </div>
        <div className="data-container delta-data-gradient">
          <div className="data-top">
            <div className="icon-back" style ={ { backgroundImage: "url("+bg+")" } }>
                <img src={delta} className="logo" alt="img"/>            
            </div>
            <div className="data-top-text">Delta</div>
          </div>
          <div className="data-bot">
              <div className="apy-text">%APY</div>
              <div className="apy-data">
                <div>24hr</div>
                <div></div>  
              </div>
              <div className="apy-data">
                <div>1w</div>
                <div></div>
              </div>
              <div className="apy-data">
                <div>1m</div>
                <div></div>
              </div>
              <div className="apy-data">
                <div>1y</div>
                <div></div>
              </div>
          </div> 
        </div>      
        <div className="data-container phoenix-data-gradient">
          <div className="data-top">
            <div className="icon-back" style ={ { backgroundImage: "url("+bg+")" } }>
                <img src={sta} className="logo" alt="img"/>            
            </div>
            <div className="data-top-text">Phoenix Fund</div>
          </div>        
          <div className="data-bot">
              <div className="apy-text">%APY</div>
              <div className="apy-data">
                <div>24hr</div>
                <div></div>  
              </div>
              <div className="apy-data">
                <div>1w</div>
                <div></div>
              </div>
              <div className="apy-data">
                <div>1m</div>
                <div></div>
              </div>
              <div className="apy-data">
                <div>1y</div>
                <div></div>
              </div>
          </div>  
        </div>       
        <div className="data-container all-data-gradient"></div>
    </div>
  }
}