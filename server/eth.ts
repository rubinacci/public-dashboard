import Web3 from 'web3';
import { Logger } from './logger';
const { exec } = require("child_process");
import * as path from 'path';
const kLoggerCategory = 'ETH';

export class Eth {

  public web3: any;
  private infuraKey: string;

  private deltaUpdatedPromise: Promise<any>;
  private phoenixUpdatedPromise: Promise<any>;

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

        this.updateDelta();
        this.updatePhoenix();

        return;
      }
      console.log(error);
    });
  }

  private updateDelta(): Promise<any> {
    if (!this.deltaUpdatedPromise) {
      this.deltaUpdatedPromise = new Promise((resolve, reject) => {
        Logger.log(kLoggerCategory, `running delta_monitor.py`);
        const startDate = new Date();
        const child = exec('python3 pool_monitor/delta_monitor.py --daemon=false', { cwd : path.join(__dirname, '../')});
        child.stdout.on('data', (data) => {
          const str = data.toString();
          const lines = str.split(/(\r?\n)/g);
          lines.forEach((l) => {
            if (l.indexOf('INSERT') > -1) {
              Logger.log(kLoggerCategory, `delta_monitor.py::${l}`);
            }
          });
        });
        child.stderr.pipe(process.stdout);
        child.on('exit', () => {
          Logger.log(kLoggerCategory, `delta_monitor.py done running. Took ${(new Date().getTime() - startDate.getTime()) / 1000} seconds`);
          this.deltaUpdatedPromise = null;
          resolve(undefined);
        });
      });
      return this.deltaUpdatedPromise;
    }
    else {
      Logger.log(kLoggerCategory, `delta_monitor.py still running... Ignoring`);
    }
  }

  private updatePhoenix(): Promise<any> {
    if (!this.phoenixUpdatedPromise) {
      this.phoenixUpdatedPromise = new Promise((resolve, reject) => {
        Logger.log(kLoggerCategory, `running phoenix_monitor.py`);
        const startDate = new Date();
        const child = exec('python3 pool_monitor/phoenix_monitor.py --daemon=false', { cwd : path.join(__dirname, '../')});
        child.stderr.pipe(process.stdout);
        child.stdout.on('data', (data) => {
          const str = data.toString();
          const lines = str.split(/(\r?\n)/g);
          lines.forEach((l) => {
            if (l.indexOf('INSERT') > -1) {
              Logger.log(kLoggerCategory, `phoenix_monitor.py::${l}`);
            }
          });
        });
        child.on('exit', () => {
          Logger.log(kLoggerCategory, `phoenix_monitor.py done running. Took ${(new Date().getTime() - startDate.getTime()) / 1000} seconds`);
          this.phoenixUpdatedPromise = null;
          resolve(undefined);
        });
      });
      return this.phoenixUpdatedPromise;
    }
    else {
      Logger.log(kLoggerCategory, `phoenix_monitor.py still running... Ignoring`);
    }
  }  
}