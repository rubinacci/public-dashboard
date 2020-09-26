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
            self.delta_eth_price = ls[14]
            self.link_eth_price = ls[15]
            self.snx_eth_price = ls[16]
            self.wbtc_eth_price = ls[17]
            
            self.eth_balance = ls[18]
            self.delta_balance = ls[19]
            self.link_balance = ls[20]
            self.snx_balance = ls[21]
            self.wbtc_balance = ls[22]
            
            self.eth_volume = ls[23]
            self.delta_volume = ls[24]
            self.link_volume = ls[25]
            self.snx_volume = ls[26]
            self.wbtc_volume = ls[27]
            
            self.phoenix_supply = ls[28]
            self.phoenix_genesis = 10372700#10372702   
            self.phoenix_address = "'0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'".lower()
            
            self.hourslot = ls[29]
        else:   
            self.num_tx = 0
            
            self.tx_hash = 0
            self.rn = 0
            self.timestamp = 0
            self.block_num = 10372700
            
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
                ,f'hourslot : {self.hourslot}' 
                ,f'#####################################']
        return '\n'.join(ls) 
        
        
    def to_list(self):
        ls = ["'"+self.tx_hash+"'",
                self.rn,
                self.timestamp,
                self.block_num,
                self.op_type,
              "'"+str(self.input_token_symbol)+"'",
                self.input_token_volume,
                self.input_token_fees,
                self.input_token_eth_price,
              "'"+str(self.output_token_symbol)+"'",
                self.output_token_volume,
                self.output_token_fees,
                self.output_token_eth_price, 
                self.eth_usd_price, 
                self.delta_eth_price,
                self.link_eth_price, 
                self.snx_eth_price,
                self.wbtc_eth_price,
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
                self.phoenix_supply, 
                self.hourslot]
              #self.delta_address
              #self.sta_address 
        return ls
    def to_sql_values(self):
        ls = [str(l) for l in self.to_list()]
        return ','.join(ls)
           
    
    def get_header(self):
        
        txt = 'tx_hash,rn,timestamp,block_num,op_type,input_token_symbol,input_token_volume,input_token_fees,input_token_eth_price,output_token_symbol,output_token_volume,output_token_fees,output_token_eth_price,eth_usd_price,delta_eth_price,link_eth_price,snx_eth_price,wbtc_eth_price,eth_balance,delta_balance,link_balance,snx_balance,wbtc_balance,eth_volume,delta_volume,link_volume,snx_volume,snx_volume,wbtc_volume,phoenix_supply,hourslot'
        
        return txt