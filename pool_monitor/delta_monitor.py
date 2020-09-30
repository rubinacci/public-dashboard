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

if (not os.getenv('HEROKU')):
    load_dotenv()

UNISWAP_FEE = 0.003

#ethpl.verbose = 1
ethsc.verbose = 1
verbose = 1

##VARS#########################################################
sta_address = '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1'.lower()
weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.lower() 
delta_address = '0x59f96b8571e3b11f859a09eaf5a790a138fc64d0'.lower() 
burn_address = '0x0000000000000000000000000000000000000000'  

debug_level = 4
sleep_time = 30
#global var for psycopg2 connection
conn = None
#global var for batch_delta_tx
delta_tx_to_store = [] 

###PARAMS##################################################
bootstrap = False # Truncates current and starts parsing from genesis
create_tables = False # Drops tables if exists and creates them
daemon = False # Keeps alive querying for new blocks once it is up to date
parser = argparse.ArgumentParser() 
parser.add_argument('--bootstrap', help='True, False | Truncates current and starts parsing from genesis')
parser.add_argument('--create_tables', help='True, False | Drops tables if exists and creates them')
parser.add_argument('--daemon', help='True, False | Keeps alive querying for new blocks once it is up to date')
args = parser.parse_args()
if args.bootstrap is not None:
    bootstrap = (args.bootstrap.lower()=='true')
if args.create_tables is not None:
    create_tables = (args.create_tables.lower()=='true')
if args.daemon is not None:
    daemon = (args.daemon=='True')
###########################################################


def get_connection():
    '''
    returns psycopg2 connection from ENV
    '''
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


def get_last_block_delta_tx_info_db():
    '''
        Queries SQL for last delta info
    '''

    print('Getting last Delta tx info from db')
    try: 
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
        print(f"get_last_block_delta_tx_info_db -> Error connecting to PostgreSQL Platform: {e}") 
        sys.exit()
        #input()
        
def save_delta_tx_info_db(dtinf):
    '''
        Queries SQL for last delta info
    '''
    try: 
        values = dtinf.to_sql_values()
        query = f'INSERT INTO delta_tx_monitor SELECT {values}'
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        #conn.close()
    except Exception as e:
        print(f"save_delta_tx_info_db -> Error connecting to PostgreSQL Platform: {e}") 
        sys.exit()
        #input()
        
def save_delta_tx_info_db_batch(dtinf, batch_size=100):
    '''
        Adds dtinf to the current batch of transactions delta_tx_to_store
        Stores transactions if over the threshold
    '''
    try:
        global delta_tx_to_store 
        if dtinf is not None:
            delta_tx_to_store.append(dtinf)
        
        if len(delta_tx_to_store) > batch_size:  
            test = [dt.to_sql_values() for dt in delta_tx_to_store]
            
            values = '\r\n union all select '.join(test)#delta_tx_to_store)
            query = f'INSERT INTO delta_tx_monitor SELECT {values}' 
            print(query)
            cur = conn.cursor()
            cur.execute(query,)   
            delta_tx_to_store = [] 
        
    except Exception as e:
        print(f"save_delta_tx_info_db_batch -> Error connecting to PostgreSQL Platform: {e}") 
        sys.exit()
        #input()
        
def dprint(msg,lvl):
    if debug_level >= lvl:
        print(msg)
        
def parse_delta_transaction(tx_id, raw_tx_delta, dtinf):  
    dprint(f'- Transaction {tx_id}', 1) 
    
    eth_volume = 0
    sta_volume = 0 
    swaps = 0
    
    in_out = 0

    input_tokens = 0
    output_tokens = 0 
    
    for op in raw_tx_delta: 
        to = op['to'].lower()
        frm = op['from'].lower()
        token_address = op['contractAddress'].lower()  
        token_symbol = op['tokenSymbol']
        input_value = int(op['value'])/(10.0**int(op['tokenDecimal']))
        timestamp = str(op['timeStamp'])
        dtinf.timestamp = timestamp
        #format hourslot
        dt_object = datetime.fromtimestamp(int(timestamp))
        hourslot = dt_object.strftime("%Y%m%d%H")
        dtinf.hourslot = int(hourslot)
        
        #liquidityRelated
        if token_address == delta_address:
            if frm == burn_address:
                # addLiquidity
                # Never happens as mint tx do not involve uni-v2 pool
                # This is addressed below 
                dtinf.op_type = 2
                #update delta supply
                dtinf.delta_supply += input_value
                
            elif to == burn_address:
                # removeLiquidity
                dtinf.op_type = 3
                #update delta supply
                dtinf.delta_supply -= input_value
        #deltapool receives tokens
        elif to == delta_address:
            input_tokens += 1
                
            dtinf.input_token_symbol = token_symbol
            dtinf.input_token_volume = input_value
            #input  weth
            if token_address == weth_address:
                #update weth balance 
                dtinf.eth_balance += input_value
                #update block volume 
                eth_volume += input_value 
                #eth in 
                in_out += 1
            #input delta 
            elif token_address == sta_address: 
                #update delta balance 
                dtinf.sta_balance += input_value
                #update block volume 
                sta_volume += input_value 
                #sta in 
                in_out += 1
        #deltapool sends tokens 
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
    if input_tokens >= 2:  
        #get possible univ2 mints
        dprint('Getting DELTA mint candidates',3)
        burn_address_tx_list = ethsc.get_transaction_history_address(burn_address,dtinf.block_num,dtinf.block_num)
        for b_tx in burn_address_tx_list:
            if b_tx['hash'] == dtinf.tx_hash:
                burn_token_address = b_tx['contractAddress']
                if burn_token_address == delta_address and b_tx['from'] == burn_address:
                    dprint('Found delta mint',3) 
                    minted_delta = int(b_tx['value'])/(10.0**int(b_tx['tokenDecimal']))
                    dtinf.delta_supply += minted_delta 
                    dtinf.op_type = 2 
                    
    #update volumes and fees
    if dtinf.op_type not in (2,3): 
        #if there's only one token involved
        if in_out <= 1:
            #set transfer / no use to the pool
            dtinf.op_type = 0 
        else:
            dtinf.eth_volume = eth_volume
            dtinf.eth_fees = eth_volume*UNISWAP_FEE
            dtinf.sta_volume = sta_volume
            dtinf.sta_fees = sta_volume*UNISWAP_FEE
            #set swap
            dtinf.op_type = 1  
    dtinf.sta_eth_price = dtinf.sta_balance / dtinf.eth_balance 
    fix_etherscan_mess(dtinf)

def fix_etherscan_mess(dtinf):
    ''' 
        Hardcodes fixes on etherscan api 'errors'
    '''
    if int(dtinf.block_num) == 10877808:
        #etherscan failed to return the tx happening on this block during development
        dtinf.sta_balance = 2557935.03678363829679168
        dtinf.eth_balance = 751.832346242725292461
        dtinf.delta_supply = 20690.84450966305008816
         
def parse_block_range_info_delta(in_block, end_block,last_dtinf): 
    #global raw_tx_delta
    #get block range transactions
    tx_list = ethsc.get_transaction_history_address(delta_address,in_block,end_block)    
    dtinf = dti.DeltaTxInfo(last_dtinf=last_dtinf)
    
    if tx_list == []:
        dprint(f'No transactions on delta Pool during block range {in_block}, {end_block}', 3)
        return dtinf
    dprint(f'Processing block range {in_block}, {end_block}',1) 
    
    raw_tx_delta = dict()
    #build dict of {k:block_num, v: [tx_list] from etherscan api}
    block_txs_dict = dict() 
    for tx in tx_list:  
        block = tx['blockNumber']
        hash = tx['hash'] 
        #new raw_tx_delta format
        if hash not in raw_tx_delta:
            raw_tx_delta[hash] = []
        raw_tx_delta[hash].append(tx)
        #
        if block not in block_txs_dict:
            block_txs_dict[block] = set()
        block_txs_dict[block].add(hash) 
        
    dprint(f'Found {len(block_txs_dict)} blocks containing transactions', 2) 
    dprint(block_txs_dict, 4) 
    for block in block_txs_dict:   
        dprint(f'Parsing Delta tx from block {block}', 2)
        tx_set = block_txs_dict[block]  
        rn = len(tx_set) 
        for tx in tx_set:
            dtinf = dti.DeltaTxInfo(last_dtinf=last_dtinf)
            dtinf.rn = rn
            dtinf.block_num = block
            dtinf.tx_hash = tx
            
            parse_delta_transaction(tx,raw_tx_delta[tx], dtinf)  
            save_delta_tx_info_db_batch(dtinf) 
            last_dtinf = dtinf 
            rn -= 1   
         
            ##input()
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
    '''
       Daemon parser 
    '''
    global conn
    conn = get_connection()
    try:
        if create_tables:
            create_delta_tx_tables() 
        if bootstrap:
            clear_delta_tx_info_db()
        #get last block available
        last_dtinf = get_last_block_delta_tx_info_db()
        
        dtinf_block_num = last_dtinf.block_num
        #set next block to start the process
        block_num = last_dtinf.block_num+1 
        current_block =int(ethsc.get_previous_block_num()) 
    except Exception as e: 
        print(f'Could not get latest delta block info  {e}')
        time.sleep(60)
        conn.close()
        sys.exit()
    step = 2000
    while True:
        try:
            while current_block < block_num:
                current_block = int(ethsc.get_previous_block_num())
                step = 2 
                save_delta_tx_info_db_batch(None,0) #save anything pending on the current batch
                if not daemon:
                    print('Done')
                    conn.close() 
                    sys.exit()
                dprint(f'Current block {current_block}, waiting for {sleep_time} sec ',1)
                time.sleep(sleep_time)
            end_block = min(int(current_block), block_num+step)  
            
            current_dtinf = parse_block_range_info_delta(block_num, end_block, last_dtinf) 
            
            last_dtinf = current_dtinf 
            block_num = end_block+1
            #input() 
        except Exception as e:
            print(f' delta daemon_blockrange says {e}') 
            conn.close()
            sys.exit()


def clear_delta_tx_info_db():
    '''
        Truncates delta_tx_monitor_table
    '''
    try: 
        query = 'truncate table delta_tx_monitor;'
        print(query)
        cur = conn.cursor()
        cur.execute(query,) 
    except Exception as e:
        print(f"clear_delta_tx_info_db -> Error connecting to PostgreSQL Platform: {e}") 
        sys.exit()
        #input()

def create_delta_tx_tables():
    try: 
        query = dti.get_create_delta_tx_table()
        print(query)
        cur = conn.cursor()
        cur.execute(query,)
        # Close Connection
        #conn.close()
    except Exception as e:
        print(f"create_delta_tx_tables -> Error connecting to PostgreSQL Platform: {e}") 
        sys.exit()
        #input()


daemon_blockrange() 