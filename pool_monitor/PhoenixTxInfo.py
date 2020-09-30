class PhoenixTxInfo:
    def __init__(self, last_ptinf = None, from_str = None, from_db = None): 
        
        if from_db is not None or from_str is not None: 
            if from_db is not None:
                ls = from_db
            if from_str is not None:
                ls = from_str.split(',')  
            self.tx_hash = ls[0]
            self.rn = ls[1]
            self.timestamp = ls[2]
            self.hourslot = ls[3]
            self.block_num = ls[4]
            
            self.op_type = ls[5]
            
            self.input_token_symbol = ls[6]
            self.input_token_volume = ls[7] 
             
            self.output_token_symbol = ls[8]
            self.output_token_volume = ls[9] 
            
            self.eth_balance = ls[10]
            self.delta_balance = ls[11]
            self.link_balance = ls[12]
            self.snx_balance = ls[13]
            self.wbtc_balance = ls[14]
            
            self.eth_volume = ls[15]
            self.delta_volume = ls[16]
            self.link_volume = ls[17]
            self.snx_volume = ls[18]
            self.wbtc_volume = ls[19]
            
            self.phoenix_supply = ls[20]
            self.phoenix_genesis = 10372700#10372702   
            self.phoenix_address = "'0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'".lower()
            
        else:   
            self.num_tx = 0
            
            self.tx_hash = 0
            self.rn = 0
            self.timestamp = 0 
            self.hourslot = 0
            self.block_num = 10372700
            
            self.op_type = 0
            
            self.input_token_symbol = ''
            self.input_token_volume = 0 
             
            self.output_token_symbol = ''
            self.output_token_volume = 0 
        
            self.eth_volume = 0
            self.delta_volume = 0
            self.link_volume = 0
            self.snx_volume = 0
            self.wbtc_volume = 0
            
            if last_ptinf is not None: 
                self.eth_usd_price = last_ptinf.eth_usd_price
                self.delta_eth_price = last_ptinf.delta_eth_price
                self.link_eth_price = last_ptinf.link_eth_price
                self.snx_eth_price = last_ptinf.snx_eth_price
                self.wbtc_eth_price = last_ptinf.wbtc_eth_price
            
                self.eth_balance = last_ptinf.eth_balance
                self.delta_balance = last_ptinf.delta_balance
                self.link_balance = last_ptinf.link_balance
                self.snx_balance = last_ptinf.snx_balance
                self.wbtc_balance = last_ptinf.wbtc_balance 
                
                self.phoenix_supply = last_ptinf.phoenix_supply
            else:
                self.eth_usd_price = 0
                self.delta_eth_price = 0
                self.link_eth_price = 0
                self.snx_eth_price = 0
                self.wbtc_eth_price = 0

                self.eth_balance = 0
                self.delta_balance = 0
                self.link_balance = 0
                self.snx_balance = 0
                self.wbtc_balance = 0 
                
                self.phoenix_supply = 0
            self.phoenix_genesis = 10372700#10372702  
            self.phoenix_address = "'0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'".lower()
            
        
    def __str__(self): 
        ls = [f'#####################################'
                ,f'tx_hash : {self.tx_hash}'
                ,f'rn : {self.rn}'
                ,f'timestamp : {self.timestamp}'
                ,f'hourslot : {self.hourslot}'
                ,f'block_num : {self.block_num}'
                ,f'op_type : {self.op_type}'
                ,f'input_token_symbol : {self.input_token_symbol}'
                ,f'input_token_volume : {self.input_token_volume}'
                ,f'input_token_fees : {self.input_token_fees}'
                ,f'input_token_eth_price : {self.input_token_eth_price}'
                ,f'output_token_symbol : {self.output_token_symbol}'
                ,f'output_token_volume : {self.output_token_volume}'
                ,f'output_token_fees : {self.output_token_fees}'
                ,f'output_token_eth_price : {self.output_token_eth_price}' 
                ,f'eth_usd_price : {self.eth_usd_price}' 
                ,f'delta_eth_price : {self.delta_eth_price}' 
                ,f'link_eth_price : {self.link_eth_price}' 
                ,f'snx_eth_price : {self.snx_eth_price}' 
                ,f'wbtc_eth_price : {self.wbtc_eth_price}'  
                ,f'eth_balance : {self.eth_balance}'
                ,f'delta_balance : {self.delta_balance}' 
                ,f'link_balance : {self.link_balance}'
                ,f'snx_balance : {self.snx_balance}'
                ,f'wbtc_balance : {self.wbtc_balance}'
                ,f'eth_volume : {self.eth_volume}'
                ,f'delta_volume : {self.delta_volume}' 
                ,f'link_volume : {self.link_volume}'
                ,f'snx_volume : {self.snx_volume}'
                ,f'wbtc_volume : {self.wbtc_volume}'
                ,f'phoenix_supply : {self.phoenix_supply}'
                ,f'phoenix_genesis : {self.phoenix_genesis}'
                ,f'phoenix_address : {self.phoenix_address}'  
                ,f'#####################################']
        return '\n'.join(ls) 
        
        
    def to_list(self):
        ls = ["'"+self.tx_hash+"'",
                self.rn,
                self.timestamp, 
                self.hourslot,
                self.block_num,
                self.op_type,
              "'"+str(self.input_token_symbol)+"'",
                self.input_token_volume, 
              "'"+str(self.output_token_symbol)+"'",
                self.output_token_volume,  
                self.eth_balance,
                self.delta_balance,
                self.link_balance,
                self.snx_balance,
                self.wbtc_balance,
                self.eth_volume,
                self.delta_volume,
                self.link_volume,
                self.snx_volume,
                self.wbtc_volume,
                self.phoenix_supply]
              #self.delta_address
              #self.sta_address 
        return ls
    def to_sql_values(self):
        ls = [str(l) for l in self.to_list()]
        return ','.join(ls)
           
    
    def get_header(self):
        
        txt = 'tx_hash,rn,timestamp,hourslot,block_num,op_type,input_token_symbol,input_token_volume,output_token_symbol,output_token_volume,eth_balance,delta_balance,link_balance,snx_balance,wbtc_balance,eth_volume,delta_volume,link_volume,snx_volume,snx_volume,wbtc_volume,phoenix_supply'
        
        return txt


def get_create_phoenix_tx_table():
    sql = '''
        drop table if exists phoenix_tx_monitor;
        
        CREATE TABLE phoenix_tx_monitor (
              tx_hash text DEFAULT NULL UNIQUE,
              rn smallint DEFAULT NULL,
              timestamp bigint DEFAULT NULL, 
              hourslot bigint DEFAULT NULL,
              block_num bigint DEFAULT NULL,
              op_type smallint DEFAULT NULL,
              input_token_symbol text DEFAULT NULL,
              input_token_volume double precision DEFAULT NULL, 
              output_token_symbol text DEFAULT NULL,
              output_token_volume double precision DEFAULT NULL, 
              eth_balance double precision DEFAULT NULL,
              delta_balance double precision DEFAULT NULL,
              link_balance double precision DEFAULT NULL,
              snx_balance double precision DEFAULT NULL,
              wbtc_balance double precision DEFAULT NULL,
              eth_volume double precision DEFAULT NULL,
              delta_volume double precision DEFAULT NULL,
              link_volume double precision DEFAULT NULL,
              snx_volume double precision DEFAULT NULL,
              wbtc_volume double precision DEFAULT NULL,
              phoenix_supply double precision DEFAULT NULL
            );
        
        create index idx_phoenix_tx_monitor_block_num
        on phoenix_tx_monitor
        using btree(block_num, rn);
        
        create index idx_phoenix_tx_monitor_ts
        on phoenix_tx_monitor
        using btree(timestamp, rn); 
        
        create index idx_phoenix_tx_monitor_hourslot
        on phoenix_tx_monitor
        using btree(hourslot, rn); 
        '''
    return sql