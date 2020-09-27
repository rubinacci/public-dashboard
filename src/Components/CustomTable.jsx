import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  formatTokens(num) {
    return this.addCommas((num / 1e18).toFixed(2));
  }
  addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  render(){
    let rows = [{pair: "0x005234", amount:"123.55", date: "XX-XX-XXXX", type: "Added", transaction: "www.etherscan.com"}];
    // let aux = this.props.topHolders?.holders?.forEach((holder, index)=>{
    //   if(index > 2){
    //     let data = createData(holder.address, this.formatTokens(holder.balance))
    //     rows.push(data)
    //   }  
    // })
    return (
        <TableContainer component={Paper}>
          <Table className="table-style" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Pair</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Transaction</TableCell>                
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row) => (
                <TableRow key={row.pair}>
                   <TableCell component="th" scope="row">
                    {row.pair}
                  </TableCell>
                  <TableCell align="right">
                    {row.amount}
                  </TableCell>
                  <TableCell align="right">{row.date}</TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.transaction}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
}