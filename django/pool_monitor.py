import json
import requests as req
from requests.exceptions import HTTPError
from datetime import datetime 
import  ethplorer_api as ethpl
import  etherscan_api as ethsc
import os
import csv 
import time
from decimal import *
getcontext().prec = 18 
import PhoenixInfo as pi
import PhoenixTxInfo as pti
import DeltaTxInfo as dti
import os.path
import mariadb
import pickle
from pycoingecko import CoinGeckoAPI
cg = CoinGeckoAPI()

BALANCER_FEE = 0.01

ethpl.verbose = 1
ethsc.verbose = 1
verbose = 1

sta_address = '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1'.lower()
weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.lower() 
delta_address = '0x59f96b8571e3b11f859a09eaf5a790a138fc64d0'.lower()
link_address = '0x514910771AF9Ca656af840dff83E8264EcF986CA'.lower()
snx_address = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F'.lower()
wbtc_address = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'.lower()

burn_address = '0x0000000000000000000000000000000000000000'
phoenix_address = '0xcd461b73d5fc8ea1d69a600f44618bdfac98364d'.lower() 

known_operations = ['0xf305d719','0xe8e33700','0x5b0d5984','0xaf2979eb' ,'0xa9059cbb' ,'0x5c11d795','0x791ac947','0x791ac947' ,'0x38ed1739','0x8803dbee' ,'0xfb3bdb41','0x7ff36ab5']

 
def fill_ptinf_prices(ptinf):
    ts = ptinf.timestamp
    range = 3600
    
    #link
    m_chart = cg.get_coin_market_chart_range_by_id('chainlink','eth',int(ts)-range,ts)
    ptinf.link_eth_price = m_chart['prices'][-1][1]
    #snx
    m_chart = cg.get_coin_market_chart_range_by_id('havven','eth',int(ts)-range,ts)
    ptinf.snx_eth_price = m_chart['prices'][-1][1]
    #wbtc
    m_chart = cg.get_coin_market_chart_range_by_id('wrapped-bitcoin','eth',int(ts)-range,ts)
    ptinf.wbtc_eth_price = m_chart['prices'][-1][1]
    #eth_usd
    m_chart = cg.get_coin_market_chart_range_by_id('ethereum','usd',int(ts)-range,ts)
    ptinf.eth_usd_price = m_chart['prices'][-1][1]
    
    
def get_last_block_phoenix_info():
    ''' 
    This method will connect to db and get last_block_phoenix_info
    '''
    fn = 'C:/Users/dbosch/Desktop/PoolMonitor/phoenix_data.txt'
    if not os.path.isfile(fn):
        print('NO FILE EXISTS; ABORT')
        pinf = pi.PhoenixInfo() 
    else:
        with open(fn,'r') as fin:
            last_pinf = fin.readlines()[-1]
        pinf = pi.PhoenixInfo(from_str=last_pinf)  
    return pinf 

def get_last_block_phoenix_info_db():

    print('Getting last block info from db')
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        )  
        
        conn.autocommit = True
        query = '''
            select *
            from phoenix_monitor
            where timestamp = (select max(timestamp) from phoenix_monitor) limit 1
            '''
        values = None 
        cur = conn.cursor()
        cur.execute(query)
        
        row = None
        for r in cur:
            row = r  
        if row is not None:
            pinf = pi.PhoenixInfo(from_db=row)
        else:
            pinf = pi.PhoenixInfo()
        # Close Connection
        conn.close() 
        return pinf
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()
        
def get_last_block_phoenix_tx_info_db():

    print('Getting last tx info from db')
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        )  
        
        conn.autocommit = True
        query = '''
            select *
            from phoenix_tx_monitor 
            order by timestamp desc, rn asc 
            limit 1
            '''
        values = None 
        cur = conn.cursor()
        cur.execute(query)
        
        row = None
        for r in cur:
            row = r  
        if row is not None:
            pinf = pti.PhoenixTxInfo(from_db=row)
        else:
            pinf = pti.PhoenixTxInfo()
        # Close Connection
        conn.close() 
        return pinf
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()
        
def get_last_block_delta_tx_info_db():

    print('Getting last tx info from db')
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        )  
        
        conn.autocommit = True
        query = '''
            select *
            from delta_tx_monitor 
            order by timestamp desc, rn asc 
            limit 1
            '''
        values = None 
        cur = conn.cursor()
        cur.execute(query)
        
        row = None
        for r in cur:
            row = r  
        if row is not None:
            pinf = dti.DeltaTxInfo(from_db=row)
        else:
            pinf = dti.DeltaTxInfo()
        # Close Connection
        conn.close() 
        return pinf
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()
        
  
def save_phoenix_info(phoenix_info, recreate=False):
    fn = 'C:/Users/dbosch/Desktop/PoolMonitor/phoenix_data.txt'
    if not os.path.isfile(fn) or recreate:
        with open(fn,'w') as fout:
            fout.write(phoenix_info.get_header()+'\n')
    with open(fn,'a+') as fout:
        ls = [str(x) for x in phoenix_info.to_list()]
        text = ','.join(ls) 
        fout.write(text+'\n')

def save_phoenix_info_db(pinf):
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        ) 
        values = pinf.to_sql_values()
        
        conn.autocommit = True
        query = f'INSERT INTO phoenix_monitor SELECT {values}'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        conn.close()
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()
        
def save_phoenix_tx_info_db(ptinf):
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        ) 
        values = ptinf.to_sql_values()
        
        conn.autocommit = True
        query = f'INSERT INTO phoenix_tx_monitor SELECT {values}'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        conn.close()
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()
        
def save_delta_tx_info_db(dtinf):
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        ) 
        values = dtinf.to_sql_values()
        conn.autocommit = True
        query = f'INSERT INTO delta_tx_monitor SELECT {values}'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        conn.close()
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()
        

def dprint(msg,lvl):
    if debug_level >= lvl:
        print(msg)
        
def parse_phoenix_transaction(tx_id, pinf, ptinf):
    op_type = 'phoenixRB'
    
    is_buy = True 
     
    dprint(f'- Transaction {tx_id}', 1)

    eth_in = 0
    eth_out = 0
    delta_in = 0
    delta_out = 0
    link_in = 0
    link_out = 0
    snx_in = 0
    snx_out = 0
    wbtc_in = 0
    wbtc_out = 0
    
    eth_volume = 0
    delta_volume = 0
    link_volume = 0
    snx_volume = 0
    wbtc_volume = 0
    swaps = 0
    
    in_out = 0

    input_tokens = 0
    output_tokens = 0

    for op in raw_tx_phoenix[tx_id]: 
        print(op)
        to = op['to'].lower()
        frm = op['from'].lower()
        token_address = op['contractAddress'].lower()
        token_symbol = op['tokenSymbol']
        input_value = int(op['value'])/(10.0**int(op['tokenDecimal']))
        timestamp = str(op['timeStamp'])
        pinf.timestamp = timestamp          
        ptinf.timestamp = timestamp         
        dt_object = datetime.fromtimestamp(int(timestamp))
        hourslot = dt_object.strftime("%Y%m%d%H")
        ptinf.hourslot = int(hourslot)         
        #liquidityRelated
        if token_address == phoenix_address:
            if frm == burn_address:
                op_type = 'addLiquidity'
                pinf.num_add_liquidity += 1
                #ptinf.op_type = 4
                ptinf.op_type = 2
                
                #update phoenix supply
                pinf.phoenix_supply += input_value#int(token_info['totalSupply']) / (10**18) 
                ptinf.phoenix_supply += input_value#int(token_info['totalSupply']) / (10**18) 
                
                #print(op_type)
                #print(input_value)
                #print(pinf.phoenix_supply) 
            elif to == burn_address:
                op_type = 'removeLiquidity'
                pinf.num_rem_liquidity += 1 
                #ptinf.op_type = 4
                ptinf.op_type = 4
                #update phoenix supply
                pinf.phoenix_supply -= input_value#int(token_info['totalSupply']) / (10**18)            
                ptinf.phoenix_supply -= input_value#int(token_info['totalSupply']) / (10**18)            
                
        #input
        elif to == phoenix_address:
            input_tokens += 1
                
            ptinf.input_token_symbol = token_symbol
            ptinf.input_token_volume = input_value
            #input  weth
            if token_address == weth_address:
                #update weth balance
                pinf.eth_balance += input_value
                ptinf.eth_balance += input_value
                 
                #update block volume 
                #pinf.eth_volume += input_value 
                eth_volume += input_value 
                #eth in
                eth_in += 1
                in_out += 1
            #input delta 
            elif token_address == delta_address: 
                #update delta balance
                pinf.delta_balance += input_value
                ptinf.delta_balance += input_value
                #update delta volume 
                #pinf.delta_volume += input_value 
                delta_volume += input_value 
                #delta in
                delta_in += 1
                in_out += 1
            #input link
            elif token_address == link_address: 
                #update link balance
                pinf.link_balance += input_value
                ptinf.link_balance += input_value
                #update link volume 
                #pinf.link_volume += input_value
                link_volume += input_value
                #link in
                link_in += 1
                in_out += 1
            #input snx
            elif token_address == snx_address: 
                #update snx balance
                pinf.snx_balance += input_value
                ptinf.snx_balance += input_value
                #update snx volume 
                #pinf.snx_volume += input_value
                snx_volume += input_value
                #snx in
                snx_in += 1
                in_out += 1
            #input wbtc
            elif token_address == wbtc_address: 
                #update wbtc balance
                pinf.wbtc_balance += input_value
                ptinf.wbtc_balance += input_value
                #update block volume 
                #pinf.wbtc_volume += input_value
                wbtc_volume += input_value
                #wbtc in
                wbtc_in += 1
                in_out += 1
                
            
            
        #output 
        elif  frm == phoenix_address:
            output_tokens += 1
            
            ptinf.output_token_symbol = token_symbol
            ptinf.output_token_volume = input_value
            #input delta 
            if token_address == weth_address:
                #update weth balance
                pinf.eth_balance -= input_value 
                ptinf.eth_balance -= input_value 
                #weth out
                eth_out += 1
                in_out += 1
            #input delta 
            elif token_address == delta_address: 
                #update delta balance
                pinf.delta_balance -= input_value  
                ptinf.delta_balance -= input_value 
                #delta out
                delta_out += 1
                in_out += 1
            #input link
            elif token_address == link_address: 
                #update link balance
                pinf.link_balance -= input_value
                ptinf.link_balance -= input_value 
                #link out
                link_out += 1 
                in_out += 1
            #input snx
            elif token_address == snx_address: 
                #update snx balance
                pinf.snx_balance -= input_value 
                ptinf.snx_balance -= input_value 
                #link out
                link_out += 1 
                in_out += 1
            #input wbtc
            elif token_address == wbtc_address: 
                #update wbtc balance
                pinf.wbtc_balance -= input_value 
                ptinf.wbtc_balance -= input_value 
                #wbtc out
                wbtc_out += 1 
                in_out += 1
        
        
    #set mulitoken liquidity operation
    if input_tokens >= 2:
        ptinf.op_type = 3
    elif output_tokens >= 2:
        ptinf.op_type = 5 
    if op_type not in ('addLiquidity','removeLiquidity'):
        if in_out == 2:
            pinf.eth_volume += eth_volume 
            pinf.delta_volume += delta_volume 
            pinf.link_volume += link_volume
            pinf.snx_volume += snx_volume    
            pinf.wbtc_volume += wbtc_volume
            
            pinf.swaps += 1
            pinf.eth_fees = pinf.eth_volume*BALANCER_FEE
            pinf.delta_fees = pinf.delta_volume*BALANCER_FEE
            pinf.link_fees = pinf.link_volume*BALANCER_FEE
            pinf.snx_fees = pinf.snx_volume*BALANCER_FEE
            pinf.wbtc_fees = pinf.wbtc_volume*BALANCER_FEE
            
            
            ptinf.eth_volume += eth_volume 
            ptinf.delta_volume += delta_volume 
            ptinf.link_volume += link_volume
            ptinf.snx_volume += snx_volume    
            ptinf.wbtc_volume += wbtc_volume
              
        
        pinf.num_eth_in += eth_in
        pinf.num_eth_out += eth_out
        pinf.num_delta_in += delta_in
        pinf.num_delta_out += delta_out
        pinf.num_link_in += link_in
        pinf.num_link_out += link_out
        pinf.num_snx_in += snx_in
        pinf.num_snx_out += snx_out
        pinf.num_wbtc_in += wbtc_in
        pinf.num_wbtc_out += wbtc_out
        
        ptinf.op_type = 1
        
def parse_block_range_info_phoenix(in_block, end_block,last_pinf, last_ptinf):
    
    global raw_tx_phoenix
    
    #get block range transactions
    tx_list = ethsc.get_transaction_history_address(phoenix_address,in_block,end_block)    
    pinf = pi.PhoenixInfo(last_pinf=last_pinf)
    ptinf = pti.PhoenixTxInfo(last_ptinf=last_ptinf)
    
    
    if tx_list == []:
        dprint(f'No transactions on phoenix Pool during block range {in_block}, {end_block}', 3)
        return pinf, ptinf
    dprint(f'Processing block range {in_block}, {end_block}',1) 
    
    raw_tx_phoenix = dict()
    block_txs_set = dict() 
    for tx in tx_list:  
        block = tx['blockNumber']
        hash = tx['hash'] 
        #new raw_tx_phoenix format
        if hash not in raw_tx_phoenix:
            raw_tx_phoenix[hash] = []
        raw_tx_phoenix[hash].append(tx)
        
        if block not in block_txs_set:
            block_txs_set[block] = set()
        block_txs_set[block].add(hash)

    
    dprint(f'Found {len(block_txs_set)} blocks containing transactions', 2) 
    dprint(block_txs_set, 4) 
    for block in block_txs_set:   
        dprint(f'Parsing tx from block {block}', 2)
        tx_set = block_txs_set[block] 
        pinf = pi.PhoenixInfo(last_pinf=last_pinf) 
        #update num_tx on block
        
        if len(tx_set) == 2:
            for tx in tx_set:
                t = raw_tx_phoenix[tx][0]
                
                print(f'tx {tx} nonce {t["nonce"]}') 
        #input()
        rn = len(tx_set)
        for tx in tx_set:
            #print(tx) 
            ptinf = pti.PhoenixTxInfo(last_ptinf=last_ptinf)
            ptinf.rn = rn
            ptinf.block_num = block
            ptinf.tx_hash = tx
            
            parse_phoenix_transaction(tx, pinf, ptinf) 
            
            save_phoenix_tx_info_db(ptinf)
            
            last_ptinf = ptinf
            rn -= 1 
         
        pinf.block_num = int(block)
        pinf.num_tx = len(tx_set) 
        last_pinf = pinf 
        
        if pinf.num_tx > 1:
            print('xxxxx')
            print(tx_set)
            #input()
    return last_pinf,last_ptinf

def parse_delta_transaction(tx_id, dtinf):
    op_type = 'phoenixRB'
    
    is_buy = True 
     
    dprint(f'- Transaction {tx_id}', 1)

    eth_in = 0
    eth_out = 0
    sta_in = 0
    sta_out = 0 
    
    eth_volume = 0
    sta_volume = 0 
    swaps = 0
    
    in_out = 0

    input_tokens = 0
    output_tokens = 0 
    
    for op in raw_tx_delta[tx_id]: 
        print(op.keys())  
        to = op['to'].lower()
        frm = op['from'].lower()
        token_address = op['contractAddress'].lower()  
        token_symbol = op['tokenSymbol']
        input_value = int(op['value'])/(10.0**int(op['tokenDecimal']))
        timestamp = str(op['timeStamp'])       
        dtinf.timestamp = timestamp         
        dt_object = datetime.fromtimestamp(int(timestamp))
        hourslot = dt_object.strftime("%Y%m%d%H")
        dtinf.hourslot = int(hourslot)         
        #liquidityRelated
        if token_address == delta_address:
            if frm == burn_address:
                op_type = 'addLiquidity' 
                #ptinf.op_type = 4
                dtinf.op_type = 2
                
                #update delta supply
                dtinf.delta_supply += input_value#int(token_info['totalSupply']) / (10**18)  
                
            elif to == burn_address:
                op_type = 'removeLiquidity' 
                #ptinf.op_type = 4
                dtinf.op_type = 4
                #update delta supply
                dtinf.delta_supply -= input_value#int(token_info['totalSupply']) / (10**18)            
        #input
        elif to == delta_address:
            input_tokens += 1
                
            dtinf.input_token_symbol = token_symbol
            dtinf.input_token_volume = input_value
            #input  weth
            if token_address == weth_address:
                #update weth balance 
                dtinf.eth_balance += input_value
                 
                #update block volume 
                #pinf.eth_volume += input_value 
                eth_volume += input_value 
                #eth in 
                in_out += 1
            #input delta 
            elif token_address == sta_address: 
                #update delta balance 
                dtinf.sta_balance += input_value
                #update delta volume 
                #pinf.delta_volume += input_value 
                sta_volume += input_value 
                #delta in 
                in_out += 1
                
            
            
        #output 
        elif  frm == delta_address:
            output_tokens += 1
            
            dtinf.output_token_symbol = token_symbol
            dtinf.output_token_volume = input_value
            #input delta 
            if token_address == weth_address:
                #update weth balance 
                dtinf.eth_balance -= input_value 
                #weth out 
                in_out += 1
            #input delta 
            elif token_address == sta_address: 
                #update delta balance 
                dtinf.sta_balance -= input_value 
                #sta out 
                in_out += 1 
        
    #set mulitoken liquidity operation
    if input_tokens >= 2:
        dtinf.op_type = 3
    elif output_tokens >= 2:
        dtinf.op_type = 5 
    if op_type not in ('addLiquidity','removeLiquidity'):
        if in_out == 2: 
            
            dtinf.eth_volume += eth_volume 
            dtinf.sta_volume += sta_volume  
              
        
        
        dtinf.op_type = 1
         

def parse_block_range_info_delta(in_block, end_block,last_dtinf):
    
    global raw_tx_delta    
    #get block range transactions
    tx_list = ethsc.get_transaction_history_address(delta_address,in_block,end_block)    
    #pinf = pi.PhoenixInfo(last_pinf=last_pinf)
    dtinf = dti.DeltaTxInfo(last_dtinf=last_dtinf)
    
    
    if tx_list == []:
        dprint(f'No transactions on delta Pool during block range {in_block}, {end_block}', 3)
        return dtinf
    dprint(f'Processing block range {in_block}, {end_block}',1) 
    
    raw_tx_delta = dict()
    block_txs_set = dict() 
    for tx in tx_list:  
        block = tx['blockNumber']
        hash = tx['hash'] 
        #new raw_tx_delta format
        if hash not in raw_tx_delta:
            raw_tx_delta[hash] = []
        raw_tx_delta[hash].append(tx)
        
        if block not in block_txs_set:
            block_txs_set[block] = set()
        block_txs_set[block].add(hash)

    
    dprint(f'Found {len(block_txs_set)} blocks containing transactions', 2) 
    dprint(block_txs_set, 4) 
    for block in block_txs_set:   
        dprint(f'Parsing Delta tx from block {block}', 2)
        tx_set = block_txs_set[block] 
        #pinf = pi.PhoenixInfo(last_pinf=last_pinf) 
        #update num_tx on block
        if len(tx_set) == 2:
            for tx in tx_set:
                t = raw_tx_delta[tx][0]
                
                print(f'tx {tx} nonce {t["nonce"]}') 
        #input()
        rn = len(tx_set)
        for tx in tx_set:
            #print(tx) 
            dtinf = dti.DeltaTxInfo(last_dtinf=last_dtinf)
            dtinf.rn = rn
            dtinf.block_num = block
            dtinf.tx_hash = tx
            
            parse_delta_transaction(tx, dtinf) 
            
            save_delta_tx_info_db(dtinf) 
            
            last_dtinf = dtinf
            rn -= 1 
         
        #pinf.block_num = int(block)
        #pinf.num_tx = len(tx_set) 
        #last_pinf = pinf 
        
         
            #input()
    return last_dtinf

def daemon_blockrange():
    #last_pinf = get_last_block_phoenix_info() 
    clear_phoenix_info_db( )
    clear_phoenix_tx_info_db( )
    clear_delta_tx_info_db( )
    last_pinf = get_last_block_phoenix_info_db()
    last_ptinf = get_last_block_phoenix_tx_info_db()
    
    last_dtinf = get_last_block_delta_tx_info_db()
    
    block_num = last_pinf.block_num + 1  
    block_num = last_dtinf.block_num
    current_block =int(ethsc.get_previous_block_num())
    
    step = 2500
    while 3500:
        try:
            while current_block < block_num:
                dprint(f'Current block {current_block}, waiting for next... ',1)
                time.sleep(13)
                current_block = int(ethsc.get_previous_block_num())
                step = 2
            end_block = min(int(current_block), block_num+step)  
            current_pinf, current_ptinf  = parse_block_range_info_phoenix(block_num, end_block, last_pinf, last_ptinf) 
            current_dtinf  = parse_block_range_info_delta(block_num, end_block, last_dtinf) 
            
            last_dtinf = current_dtinf
            last_pinf = current_pinf
            last_ptinf = current_ptinf
            block_num = end_block+1 
            #input()
            pass
        except Exception as e:
            print(e)
            print('daemon_blockrange says AAAAAAAAAAAAAAAAAAAA')
            time.sleep(60)
            

def clear_phoenix_info_db( ):
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        )  
        
        conn.autocommit = True
        query = 'truncate table phoenix_monitor;'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        conn.close()
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()
                
def clear_phoenix_tx_info_db( ):
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        )  
        
        conn.autocommit = True
        query = 'truncate table phoenix_tx_monitor;'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        conn.close()
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()

def clear_delta_tx_info_db( ):
    try:
        conn = mariadb.connect(
            user="statera",
            password="statera",
            host="localhost",
            port=3306,
            database="statera_monitor" 
        )  
        
        conn.autocommit = True
        query = 'truncate table delta_tx_monitor;'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        conn.close()
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}") 
        input()


debug_level = 4

raw_tx_phoenix = dict()
#bootstrap()
###########daemon############################################### 
#daemon()
daemon_blockrange()
################################################################