import Web3 from 'web3';
import { Logger } from './logger';

const kLoggerCategory = 'ETH';

export class Eth {

  public web3: any;
  private infuraKey: string;

  constructor(infuraKey: string) {
    this.infuraKey = infuraKey;
    this.setup();
  }

  private setup() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${this.infuraKey}`))

    this.web3.eth.subscribe("newBlockHeaders", async (error, event) => {
      if (!error) {
        const date = new Date();
        Logger.log(kLoggerCategory, `${date} New block: ${event.number}`);
        return;
      }
      console.log(error);
    });
  }
}