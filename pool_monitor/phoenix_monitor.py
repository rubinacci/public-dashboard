import json
import requests as req
import etherscan_api as ethsc
from datetime import datetime
import os 
import time
import PhoenixInfo as pi
import PhoenixTxInfo as pti
import sys
import argparse 
import psycopg2 as pg 
from decimal import *
getcontext().prec = 18 
from dotenv import load_dotenv

if (not os.getenv('HEROKU')):
    load_dotenv()

BALANCER_FEE = 0.01

#ethpl.verbose = 1
ethsc.verbose = 1 

##VARS######################################################### 
weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.lower()
delta_address = '0x59f96b8571e3b11f859a09eaf5a790a138fc64d0'.lower()
link_address = '0x514910771AF9Ca656af840dff83E8264EcF986CA'.lower()
snx_address = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F'.lower()
wbtc_address = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'.lower()

burn_address = '0x0000000000000000000000000000000000000000'
phoenix_address = '0xcd461b73d5fc8ea1d69a600f44618bdfac98364d'.lower() 



debug_level = 4 
sleep_time = 30 #for daemon mode

raw_tx_phoenix = dict()

#global var for psycopg2 connection
conn = None 
#global var for batch_delta_tx
phoenix_tx_to_store = [] 
###PARAMS##################################################
bootstrap = False
create_tables = False
daemon = False
parser = argparse.ArgumentParser() 
parser.add_argument('--bootstrap', help='True, False | Default False')
parser.add_argument('--create_tables', help='True, False | Drops tables if exists and creates them')
parser.add_argument('--daemon', help='True, False | Keeps alive querying for new blocks once it is up to date')
args = parser.parse_args()
if args.bootstrap is not None:
    bootstrap = (args.bootstrap=='True')
if args.create_tables is not None:
    create_tables = (args.create_tables=='True')
if args.daemon is not None:
    daemon = (args.daemon=='True')
 
################################################################
 
def get_connection():
    try:
        print('Getting connection to Elephant') 
        dbhost=os.getenv('DBHOST')
        dbname=os.getenv('DBNAME')
        dbuser=os.getenv('DBUSER')
        dbpassword=os.getenv('DBPWD')
        connection_string = f'host={dbhost} dbname={dbname} user={dbuser} password={dbpassword}'
        conn = pg.connect(connection_string) 
        
        conn.autocommit = True 
        return conn
    except Exception as e:
        print(f"Error conecting to PostgresqlDB Platform: {e}") 
        sys.exit()

 
def get_last_phoenix_tx_info_db():

    print('Getting last Phoenix tx info from db')
    try:
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
        
        return pinf
    except mariadb.Error as e:
        print(f"get_last_phoenix_tx_info_db -> Error connecting to PostgreSQL Platform: {e}") 
        conn.close()
        sys.exit()
       #input()

def save_phoenix_tx_info_db(ptinf):
    try:        
        values = ptinf.to_sql_values()
        query = f'INSERT INTO phoenix_tx_monitor SELECT {values}'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
    except mariadb.Error as e:
        print(f"save_phoenix_tx_info_db -> Error connecting to PostgreSQL Platform: {e}") 
        conn.close()
        sys.exit()
       #input()

def save_phoenix_tx_info_db_batch(ptinf, batch_size=100):
    try:
        global phoenix_tx_to_store
        
        if ptinf is not None:
            phoenix_tx_to_store.append(ptinf.to_sql_values())
        
        if len(phoenix_tx_to_store) > batch_size:  
            values = '\r\n union all select '.join(phoenix_tx_to_store)
            query = f'INSERT INTO phoenix_tx_monitor SELECT {values}' 
            print(query)
            cur = conn.cursor()
            cur.execute(query,)   
            phoenix_tx_to_store = [] 
        
    except mariadb.Error as e:
        print(f"save_phoenix_tx_info_db_batch -> Error connecting to PostgreSQL Platform: {e}") 
        conn.close()
        sys.exit()
       #input()

def dprint(msg,lvl):
    if debug_level >= lvl:
        print(msg)
        
def parse_phoenix_transaction(tx_id, raw_tx_phoenix,  ptinf):
    op_type = 'phoenixRB'
     
     
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

    for op in raw_tx_phoenix: #[tx_id]: 
        to = op['to'].lower()
        frm = op['from'].lower()
        token_address = op['contractAddress'].lower()
        token_symbol = op['tokenSymbol']
        input_value = int(op['value'])/(10.0**int(op['tokenDecimal']))
        timestamp = str(op['timeStamp']) 
        ptinf.timestamp = timestamp         
        dt_object = datetime.fromtimestamp(int(timestamp))
        hourslot = dt_object.strftime("%Y%m%d%H")
        ptinf.hourslot = int(hourslot)         
        #liquidityRelated
        if token_address == phoenix_address:
            if frm == burn_address:
                op_type = 'addLiquidity'  
                ptinf.op_type = 2 
                #update phoenix supply 
                ptinf.phoenix_supply += input_value 
            elif to == burn_address:
                op_type = 'removeLiquidity'  
                ptinf.op_type = 3
                #update phoenix supply
                ptinf.phoenix_supply -= input_value 
                
        #input
        elif to == phoenix_address:
            input_tokens += 1
                
            ptinf.input_token_symbol = token_symbol
            ptinf.input_token_volume = input_value
            #input  weth
            if token_address == weth_address:
                #update weth balance 
                ptinf.eth_balance += input_value 
                #update block volume  
                eth_volume += input_value 
                #eth in
                eth_in += 1
                in_out += 1
            #input delta 
            elif token_address == delta_address: 
                #update delta balance 
                ptinf.delta_balance += input_value
                #update delta volume  
                delta_volume += input_value 
                #delta in
                delta_in += 1
                in_out += 1
            #input link
            elif token_address == link_address: 
                #update link balance 
                ptinf.link_balance += input_value
                #update link volume  
                link_volume += input_value
                #link in
                link_in += 1
                in_out += 1
            #input snx
            elif token_address == snx_address: 
                #update snx balance 
                ptinf.snx_balance += input_value
                #update snx volume  
                snx_volume += input_value
                #snx in
                snx_in += 1
                in_out += 1
            #input wbtc
            elif token_address == wbtc_address: 
                #update wbtc balance 
                ptinf.wbtc_balance += input_value
                #update block volume  
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
                ptinf.eth_balance -= input_value 
                #weth out 
                in_out += 1
            #input delta 
            elif token_address == delta_address: 
                #update delta balance 
                ptinf.delta_balance -= input_value 
                #delta out
                delta_out += 1
                in_out += 1
            #input link
            elif token_address == link_address: 
                #update link balance 
                ptinf.link_balance -= input_value 
                #link out
                link_out += 1 
                in_out += 1
            #input snx
            elif token_address == snx_address: 
                #update snx balance 
                ptinf.snx_balance -= input_value 
                #link out
                link_out += 1 
                in_out += 1
            #input wbtc
            elif token_address == wbtc_address: 
                #update wbtc balance 
                ptinf.wbtc_balance -= input_value 
                #wbtc out
                wbtc_out += 1 
                in_out += 1
        
        
    #set multitoken liquidity operation
    #if input_tokens >= 2 and op_type = 2:
        #update type to multitoken addition
    #    ptinf.op_type = 4
    #elif output_tokens >= 2:
    #    ptinf.op_type = 5 
    if ptinf.op_type not in (2,3):
        if in_out <= 1: 
            #transfer
            ptinf.op_type = 0
        else:
            ptinf.eth_volume += eth_volume 
            ptinf.delta_volume += delta_volume 
            ptinf.link_volume += link_volume
            ptinf.snx_volume += snx_volume    
            ptinf.wbtc_volume += wbtc_volume
            ptinf.op_type = 1
            
         
def parse_block_range_info_phoenix(in_block, end_block, last_ptinf):
    
    #global raw_tx_phoenix
    
    #get block range transactions
    tx_list = ethsc.get_transaction_history_address(phoenix_address,in_block,end_block)    
    ptinf = pti.PhoenixTxInfo(last_ptinf=last_ptinf)
    
    
    if tx_list == []:
        dprint(f'No transactions on phoenix Pool during block range {in_block}, {end_block}', 3)
        return ptinf
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
            
            parse_phoenix_transaction(tx, raw_tx_phoenix[tx], ptinf)  
            save_phoenix_tx_info_db_batch(ptinf)  
            last_ptinf = ptinf
            rn -= 1 
           
    return last_ptinf
 
def daemon_blockrange(): 
    global conn
    conn = get_connection()
    try:
        if create_tables:
            create_phoenix_tx_tables()
        if bootstrap:
            clear_phoenix_tx_info_db( )  
        #get last block available
        last_ptinf = get_last_phoenix_tx_info_db() 
        phoenix_block_num = last_ptinf.block_num   
        #set next block to start the process
        block_num = phoenix_block_num+1  
        current_block =int(ethsc.get_previous_block_num())
    except Exception as e: 
        print(f'daemon_blockrange Couldnt get latest info from db -> {e}') 
        conn.close()
    step = 2000
    while True:
        try:
            while current_block < block_num:
                dprint(f'Current block {current_block}, waiting for next... ',1)
                current_block = int(ethsc.get_previous_block_num())  
                save_phoenix_tx_info_db_batch(None,0)
                if not daemon:
                    print('Done')
                    conn.close()
                    sys.exit()
                time.sleep(sleep_time)
            end_block = min(int(current_block), block_num+step)   
            print(f'from {block_num} to {end_block}')
            current_ptinf  = parse_block_range_info_phoenix(block_num, end_block, last_ptinf)  
              
            last_ptinf = current_ptinf
            block_num = end_block+1
            #input()
            pass
        except Exception as e: 
            print(f'delta daemon_blockrange -> {e}') 
            conn.close()
            sys.exit()

def clear_phoenix_info_db( ):
    try:
        #conn = mariadb.connect(
        #    user="depe6oz7701bymwh",
        #    password="onbnn14iazaj6of1",
        #    host="ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        #    port=3306,
        #    database="vqcrwbwrwvzrgbag" 
        #)  
        #
        #conn.autocommit = True
        #conn = get_connection()
        query = 'truncate table phoenix_monitor;'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        #conn.close()
    except Exception as e:
        print(f"clear_phoenix_info_db -> Error connecting to PostgreSQL Platform: {e}") 
        conn.close()
        sys.exit()
       #input()
                
def clear_phoenix_tx_info_db( ):
    try:
        #conn = mariadb.connect(
        #    user="depe6oz7701bymwh",
        #    password="onbnn14iazaj6of1",
        #    host="ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        #    port=3306,
        #    database="vqcrwbwrwvzrgbag" 
        #)  
        #
        #conn.autocommit = True
        #conn = get_connection()
        query = 'truncate table phoenix_tx_monitor;'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        #conn.close()
    except Exception as e:
        print(f"clear_phoenix_tx_info_db -> Error connecting to PostgreSQL Platform: {e}") 
        conn.close()
        sys.exit()
       #input()

def create_phoenix_tx_tables():
    try: 
        query = pti.get_create_phoenix_tx_table()
        print(query)
        cur = conn.cursor()
        cur.execute(query,) 
    except Exception as e:
        print(f"create_delta_tx_tables -> Error connecting to PostgreSQL Platform: {e}") 
        conn.close()
        sys.exit()
       #input()


 
daemon_blockrange()