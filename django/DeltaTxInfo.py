class DeltaTxInfo:
    def __init__(self, last_dtinf = None, from_str = None, from_db = None): 
        
        if from_db is not None or from_str is not None: 
            if from_db is not None:
                ls = from_db
            
            ls = from_str.split(',')  
            self.tx_hash = ls[0]
            self.rn = ls[1]
            self.timestamp = ls[2]
            self.block_num = ls[3]
            
            self.op_type = ls[4]
            
            self.input_token_symbol = ls[5]
            self.input_token_volume = ls[6]
            self.input_token_fees = ls[7]
            self.input_token_eth_price = ls[8]
             
            self.output_token_symbol = ls[9]
            self.output_token_volume = ls[10]
            self.output_token_fees = ls[11]
            self.output_token_eth_price = ls[12]
            
            self.eth_usd_price = ls[13]
            self.sta_eth_price = ls[14]
            
            self.eth_balance = ls[18]
            self.sta_balance = ls[19] 
            
            self.eth_volume = ls[20]
            self.sta_volume = ls[21] 
            
            self.delta_supply = ls[22]
            self.delta_genesis = 10161738#10372702  
            self.delta_address = "'0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'".lower()
            self.hourslot = ls[23] 
        else:   
            self.num_tx = 0
            
            self.tx_hash = 0
            self.rn = 0
            self.timestamp = 0
            self.block_num = 10161738
            
            self.op_type = 0
            
            self.input_token_symbol = ''
            self.input_token_volume = 0
            self.input_token_fees = 0 
            self.input_token_eth_price = 0
             
            self.output_token_symbol = ''
            self.output_token_volume = 0
            self.output_token_fees = 0 
            self.output_token_eth_price = 0
            
            
            self.eth_volume = 0
            self.sta_volume = 0
            
            if last_dtinf is not None: 
                self.eth_usd_price = last_dtinf.eth_usd_price
                self.sta_eth_price = last_dtinf.sta_eth_price
              
                self.eth_balance = last_dtinf.eth_balance
                self.sta_balance = last_dtinf.sta_balance 
                
                self.delta_supply = last_dtinf.delta_supply
            else:
                self.eth_usd_price = 0
                self.sta_eth_price = 0 

                self.eth_balance = 0
                self.sta_balance = 0 
                
                self.delta_supply = 0
            self.delta_genesis = 10161738#10372702  
            self.delta_address = "'0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'".lower()
            self.hourslot = 0
        
    def __str__(self): 
        ls = [f'#####################################'
                ,f'tx_hash : {self.tx_hash}'
                ,f'rn : {self.rn}'
                ,f'timestamp : {self.timestamp}'
                ,f'block_num : {self.block_num}'
                ,f'op_type : {self.op_type}'
                ,f'input_token_symbol : {self.input_token_symbol}'
                ,f'input_token_volume : {self.input_token_volume}'
                ,f'input_token_fees : {self.input_token_fees}'
                ,f'input_token_eth_price : {self.input_token_eth_price}'
                ,f'output_token_symbol : {self.output_token_symbol}'
                ,f'output_token_fees : {self.output_token_fees}'
                ,f'output_token_eth_price : {self.output_token_eth_price}' 
                ,f'eth_usd_price : {self.eth_usd_price}' 
                ,f'sta_eth_price : {self.sta_eth_price}' 
                ,f'eth_balance : {self.eth_balance}'
                ,f'sta_balance : {self.sta_balance}' 
                ,f'eth_volume : {self.eth_balance}'
                ,f'sta_volume : {self.sta_volume}' 
                ,f'delta_supply : {self.delta_supply}'
                ,f'delta_genesis : {self.delta_genesis}'
                ,f'delta_address : {self.delta_address}' 
                ,f'hourslot : {self.hourslot}' 
                ,f'#####################################']
        return '\n'.join(ls) 
        
        
    def to_list(self):
        ls = ["'"+str(self.tx_hash)+"'",
                self.rn,
                self.timestamp,
                self.block_num,
                self.op_type,
              "'"+str(self.input_token_symbol)+"'",
                self.input_token_volume,
                self.input_token_fees,
                self.input_token_eth_price,
              "'"+str(self.output_token_symbol)+"'",
                self.output_token_fees,
                self.output_token_eth_price, 
                self.eth_usd_price, 
                self.sta_eth_price, 
                self.eth_balance,
                self.sta_balance, 
                self.eth_volume,
                self.sta_volume, 
                self.delta_supply,
                self.delta_genesis,
                self.delta_address,
                self.hourslot]
              #self.delta_address
              #self.sta_address 
        return ls
    def to_sql_values(self):
        
        print(1)
        ls = [str(l) for l in self.to_list()]
        print(2)
        return ','.join(ls)
           
    
    def get_header(self):
        
        txt = 'tx_hash,rn,timestamp,block_num,op_type,input_token_symbol,input_token_volume,input_token_fees,input_token_eth_price,output_token_symbol,output_token_fees,output_token_eth_price,eth_usd_price,sta_eth_price,eth_balance,sta_balance,eth_volume,sta_volume,delta_supply,delta_genesis,delta_address,hourslot'
        
        return txt