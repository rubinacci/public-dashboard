class DeltaTxInfo:
    def __init__(self, last_dtinf = None, from_str = None, from_db = None): 
        '''
            from_db : DeltaTxInfo from database as list
            from_str : string of values delimited by , 
            last_dtinf : DeltaTxInfo object, creates a new instance using latest supply and balance
        '''
        if from_db is not None or from_str is not None: 
            if from_db is not None:
                ls = from_db
                print(ls)
                print(len(ls))
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
            self.sta_eth_price = ls[10]  
            self.eth_balance = ls[11]
            self.sta_balance = ls[12]  
            self.eth_volume = ls[13]
            self.sta_volume = ls[14]  
            self.delta_supply = ls[15]
            self.delta_genesis = 10161737#10372702  
            self.delta_address = "'0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'".lower()
            
        else:   
            self.num_tx = 0
            
            self.tx_hash = 0
            self.rn = 0
            self.timestamp = 0
            self.block_num = 10161737
            
            self.op_type = 0
            
            self.input_token_symbol = ''
            self.input_token_volume = 0 
             
            self.output_token_symbol = ''
            self.output_token_volume = 0 
            
            
            self.eth_volume = 0
            self.sta_volume = 0
            
            if last_dtinf is not None:  
                self.sta_eth_price = last_dtinf.sta_eth_price
              
                self.eth_balance = last_dtinf.eth_balance
                self.sta_balance = last_dtinf.sta_balance 
                
                self.delta_supply = last_dtinf.delta_supply
            else: 
                self.sta_eth_price = 0 

                self.eth_balance = 0
                self.sta_balance = 0 
                
                self.delta_supply = 0
            self.delta_genesis = 10161737#  
            self.delta_address = "'0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'".lower()
            self.hourslot = 0
        
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
                ,f'output_token_symbol : {self.output_token_symbol}'
                ,f'output_token_volume : {self.output_token_volume}'  
                ,f'sta_eth_price : {self.sta_eth_price}' 
                ,f'eth_balance : {self.eth_balance}'
                ,f'sta_balance : {self.sta_balance}' 
                ,f'eth_volume : {self.eth_volume}'
                ,f'sta_volume : {self.sta_volume}' 
                ,f'delta_supply : {self.delta_supply}'
                ,f'delta_genesis : {self.delta_genesis}'
                ,f'delta_address : {self.delta_address}' 
                ,f'#####################################']
        return '\n'.join(ls) 
        
        
    def to_list(self):
        ls = ["'"+str(self.tx_hash)+"'",
                self.rn,
                self.timestamp, 
                self.hourslot,
                self.block_num,
                self.op_type,
              "'"+str(self.input_token_symbol)+"'",
                self.input_token_volume, 
              "'"+str(self.output_token_symbol)+"'",
                self.output_token_volume,  
                self.eth_balance/
                self.sta_balance, #sta_eth price on current block
                self.eth_balance,
                self.sta_balance, 
                self.eth_volume,
                self.sta_volume, 
                self.delta_supply] 
        return ls
    def to_sql_values(self):
         
        ls = [str(l) for l in self.to_list()] 
        return ','.join(ls)
           
    
    def get_header(self):
        
        txt = 'tx_hash,rn,timestamp,hourslot,block_num,op_type,input_token_symbol,input_token_volume,output_token_symbol,output_token_volume,sta_eth_price,eth_balance,sta_balance,eth_volume,sta_volume,delta_supply'
        
        return txt

def get_create_delta_tx_table():
    sql = '''
        drop table if exists delta_tx_monitor;
        CREATE TABLE delta_tx_monitor (
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
          sta_eth_price double precision DEFAULT NULL,
          eth_balance double precision DEFAULT NULL,
          sta_balance double precision DEFAULT NULL,
          eth_volume double precision DEFAULT NULL,
          sta_volume double precision DEFAULT NULL,
          delta_supply double precision DEFAULT NULL
        );
        
        create index idx_delta_tx_monitor_block_num
        on delta_tx_monitor
        using btree(block_num, rn);
        
        create index idx_delta_tx_monitor_ts
        on delta_tx_monitor
        using btree(timestamp, rn);
        
        
        '''
    return sql