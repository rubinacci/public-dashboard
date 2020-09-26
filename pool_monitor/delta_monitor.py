import json
import requests as req
from requests.exceptions import HTTPError
from datetime import datetime 
#import  ethplorer_api as ethpl
import  etherscan_api as ethsc
import os
import csv 
import time
from decimal import *
getcontext().prec = 18  
import DeltaTxInfo as dti
import os.path
#import mariadb
import pickle
import sys
import argparse
#from pycoingecko import CoinGeckoAPI
import psycopg2 as pg 
from dotenv import load_dotenv

if (!os.getenv('HEROKU'))
  load_dotenv()

BALANCER_FEE = 0.01

#ethpl.verbose = 1
ethsc.verbose = 1
verbose = 1

sta_address = '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1'.lower()
weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.lower() 
delta_address = '0x59f96b8571e3b11f859a09eaf5a790a138fc64d0'.lower() 
burn_address = '0x0000000000000000000000000000000000000000' 
 
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
    
def get_connection():
    try:
        print('Getting connection to Elephant') 
        dbhost=os.getenv('DBHOST')#'lallah.db.elephantsql.com'
        dbname=os.getenv('DBNAME')#'pkfysgzf'
        dbuser=os.getenv('DBUSER')#'pkfysgzf'
        dbpassword=os.getenv('DBPWD')#'UbFSyHG98dCdAX2S3gz0XbYukzsEEa1i'
        connection_string = f'host={dbhost} dbname={dbname} user={dbuser} password={dbpassword}'
        conn = pg.connect(connection_string) 
        
        conn.autocommit = True 
        return conn
    except Exception as e:
        print(f"Error conecting to PostgresqlDB Platform: {e}") 
        sys.exit()


def get_connection_mariadb():
    try:
        print('Getting connection to MariaDB') 
         
        conn = mariadb.connect(
            user="depe6oz7701bymwh",
            password="onbnn14iazaj6of1",
            host="ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
            port=3306,
            database="vqcrwbwrwvzrgbag" ) 
        
        conn.autocommit = True
    
        return conn
    except mariadb.Error as e:
        print(f"Error conecting to MariaDB Platform: {e}")
        sys.exit()


def get_last_block_delta_tx_info_db():

    print('Getting last Delta tx info from db')
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
        #conn.close() 
        return pinf
    except Exception as e:
        print(f"get_last_block_delta_tx_info_db -> Error connecting to MariaDB Platform: {e}") 
        input()
        
def save_delta_tx_info_db(dtinf):
    try:
        #conn = mariadb.connect(
        #    user="depe6oz7701bymwh",
        #    password="onbnn14iazaj6of1",
        #    host="ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        #    port=3306,
        #    database="vqcrwbwrwvzrgbag" 
        #) 
        #conn.autocommit = True
        #conn = get_connection()
        values = dtinf.to_sql_values()
        query = f'INSERT INTO delta_tx_monitor SELECT {values}'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        #conn.close()
    except Exception as e:
        print(f"save_delta_tx_info_db -> Error connecting to MariaDB Platform: {e}") 
        input()
        
def save_delta_tx_info_db_batch(dtinf, batch_size=100):
    try:
        #conn = mariadb.connect(
        #    user="depe6oz7701bymwh",
        #    password="onbnn14iazaj6of1",
        #    host="ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        #    port=3306,
        #    database="vqcrwbwrwvzrgbag" 
        #) 
        #conn.autocommit = True
        global delta_tx_to_store 
        if dtinf is not None:
            delta_tx_to_store.append(dtinf.to_sql_values())
        
        if len(delta_tx_to_store) > batch_size: 
            #conn = get_connection()
            
            values = '\r\n union all select '.join(delta_tx_to_store)
            query = f'INSERT INTO delta_tx_monitor SELECT {values}' 
            print(query)
            cur = conn.cursor()
            cur.execute(query,)   
            delta_tx_to_store = []
            # Close Connection
            #conn.close()
        
    except Exception as e:
        print(f"save_delta_tx_info_db_batch -> Error connecting to MariaDB Platform: {e}") 
        input()
        
def dprint(msg,lvl):
    if debug_level >= lvl:
        print(msg)
        
def parse_delta_transaction(tx_id, dtinf):
    op_type = 'addLiquidity'
    
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
                dtinf.op_type = 3
                
                #update delta supply
                dtinf.delta_supply += input_value#int(token_info['totalSupply']) / (10**18)  
                
            elif to == burn_address:
                op_type = 'removeLiquidity' 
                #ptinf.op_type = 4
                dtinf.op_type = 5
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
            
            if to != burn_address:
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
        
    
    #liquidity addition candidate
    if input_tokens == 2:  
        #let's get univ2 mints
        burn_address_tx_list = ethsc.get_transaction_history_address(burn_address,dtinf.block_num,dtinf.block_num,)    
        for b_tx in burn_address_tx_list:
            if b_tx['hash'] == dtinf.tx_hash:
                print(b_tx)
                burn_token_address = b_tx['contractAddress']
                if burn_token_address == delta_address and b_tx['from'] == burn_address:
                    print('delta mint')
                    minted_delta = int(b_tx['value'])/(10.0**int(b_tx['tokenDecimal']))
                    dtinf.delta_supply += minted_delta
                    #input()
                    dtinf.op_type = 3
    #2 + 1 to ackowledge statera burn
    if output_tokens == 3:
        print('Add liquidity candidate')
        print(f'---------- {tx_id}') 
        dtinf.op_type = 5
        if input_tokens == 2:
            print('May day')
            input()
    #set mulitoken liquidity operation
    #if op_type not in ('addLiquidity','removeLiquidity'):
    if dtinf.op_type not in (3,5): 
        if in_out in (2,3): 
            dtinf.eth_volume += eth_volume 
            dtinf.sta_volume += sta_volume  
        else:
            #transfer candidate
            #print('This is a transfer')
            #print(eth_volume)
            #print(sta_volume)
            #dtinf.eth_balance -= eth_volume 
            #dtinf.sta_balance -= sta_volume  
            dtinf.op_type = -1
            return
        
        
        dtinf.op_type = 1
    fix_etherscan_mess(dtinf)

def fix_etherscan_mess(dtinf):
    if int(dtinf.block_num) == 10877808:
        dtinf.sta_balance = 2557935.03678363829679168
        dtinf.eth_balance = 751.832346242725292461
         
def parse_block_range_info_delta(in_block, end_block,last_dtinf):
    global delta_tx_to_store 
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
        #input()
        rn = len(tx_set)
        for tx in tx_set:
            #print(tx) 
            dtinf = dti.DeltaTxInfo(last_dtinf=last_dtinf)
            dtinf.rn = rn
            dtinf.block_num = block
            dtinf.tx_hash = tx
            
            parse_delta_transaction(tx, dtinf) 
            
            #fix_etherscan_mess(dtinf)
            
            
            #delta_tx_to_store.append(dtinf.to_sql_values())
            save_delta_tx_info_db_batch(dtinf)
            #print(delta_tx_to_store)
            #input()
            #save_delta_tx_info_db(dtinf) 
            last_dtinf = dtinf
            rn -= 1  
        #pinf.block_num = int(block)
        #pinf.num_tx = len(tx_set) 
        #last_pinf = pinf 
        
         
            #input()
    return last_dtinf

def level_monitor_tables(block_num):
    '''
        Deletes from monitoring tables and sets them on the same block
    '''
    dprint(f'Leveling database to block {block_num}',3)
    query = f'delete from phoenix_tx_monitor where block_num >= {block_num}' 
    print(query)
    cur = conn.cursor()
    cur.execute(query,)
    query = f'delete from delta_tx_monitor where block_num >= {block_num}' 
    print(query)
    cur = conn.cursor()
    cur.execute(query,)

def daemon_blockrange(): 
    global conn
    conn = get_connection()
    if create_tables:
        create_delta_tx_tables() 
    if bootstrap: 
        clear_delta_tx_info_db( )
    last_dtinf = get_last_block_delta_tx_info_db()
     
    dtinf_block_num = last_dtinf.block_num
     
    block_num = last_dtinf.block_num+1
    
    #level_monitor_tables(block_num) 
    current_block =int(ethsc.get_previous_block_num()) 
    step = 2000
    while True:
        try:
            while current_block < block_num:
                dprint(f'Current block {current_block}, waiting for next... ',1)
                current_block = int(ethsc.get_previous_block_num())
                step = 2
                
                save_delta_tx_info_db_batch(None,0) 
                if not daemon:
                    print('Done')
                    sys.exit()
                time.sleep(13)
            end_block = min(int(current_block), block_num+step)  
            
            print(f'from {block_num} to {end_block}')
            
            current_dtinf = parse_block_range_info_delta(block_num, end_block, last_dtinf) 
             
            last_dtinf = current_dtinf 
            block_num = end_block+1
            #input()
            pass
        except Exception as e:
            print(e)
            print('daemon_blockrange says AAAAAAAAAAAAAAAAAAAA')
            time.sleep(60)
            conn.close()


def clear_delta_tx_info_db( ):
    try: 
        query = 'truncate table delta_tx_monitor;'
        print(query)
        cur = conn.cursor()
        cur.execute(query,) 
    except Exception as e:
        print(f"clear_delta_tx_info_db -> Error connecting to MariaDB Platform: {e}") 
        input()

def create_delta_tx_tables():
    try: 
        query = '''
        drop table if exists delta_tx_monitor;
        CREATE TABLE delta_tx_monitor (
          tx_hash text DEFAULT NULL,
          rn smallint DEFAULT NULL,
          timestamp bigint DEFAULT NULL,
          block_num bigint DEFAULT NULL,
          op_type smallint DEFAULT NULL,
          input_token_symbol text DEFAULT NULL,
          input_token_volume double precision DEFAULT NULL,
          input_token_fees double precision DEFAULT NULL,
          input_token_eth_price double precision DEFAULT NULL,
          output_token_symbol text DEFAULT NULL,
          output_token_volume double precision DEFAULT NULL,
          output_token_fees double precision DEFAULT NULL,
          output_token_eth_price double precision DEFAULT NULL,
          sta_eth_price double precision DEFAULT NULL,
          eth_usd_price double precision DEFAULT NULL,
          eth_balance double precision DEFAULT NULL,
          sta_balance double precision DEFAULT NULL,
          eth_volume double precision DEFAULT NULL,
          sta_volume double precision DEFAULT NULL,
          delta_supply double precision DEFAULT NULL, 
          hourslot bigint DEFAULT NULL
        );
        
        create index idx_delta_tx_monitor_block_num
        on delta_tx_monitor
        using btree(block_num, rn);
        
        create index idx_delta_tx_monitor_ts
        on delta_tx_monitor
        using btree(timestamp, rn);
        
        
        '''
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        #conn.close()
    except Exception as e:
        print(f"create_delta_tx_tables -> Error connecting to MariaDB Platform: {e}") 
        input()



debug_level = 4
 
conn = None
delta_tx_to_store = []
phoenix_tx_to_store = []

bootstrap = False
create_tables = False
daemon = False
parser = argparse.ArgumentParser() 
parser.add_argument('--bootstrap', help='True, False | Truncates current and starts parsing from genesis')
parser.add_argument('--create_tables', help='True, False | Drops tables if exists and creates them')
parser.add_argument('--daemon', help='True, False | Keeps alive querying for new blocks once it is up to date')
args = parser.parse_args()
if args.bootstrap is not None:
    bootstrap = (args.bootstrap=='True')
if args.create_tables is not None:
    create_tables = (args.create_tables=='True')
if args.daemon is not None:
    daemon = (args.daemon=='True')

#bootstrap()
###########daemon############################################### 
#daemon()
daemon_blockrange()
################################################################