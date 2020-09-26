class PhoenixInfo:
    def __init__(self, last_pinf = None, from_str = None, from_db = None): 
        if last_pinf is not None:  
            self.num_tx = 0
            self.num_eth_in = 0
            self.num_eth_out = 0
            self.num_delta_in = 0
            self.num_delta_out = 0
            self.num_link_in = 0
            self.num_link_out = 0
            self.num_snx_in = 0
            self.num_snx_out = 0
            self.num_wbtc_in = 0
            self.num_wbtc_out = 0
            
            self.swaps = 0
            
            self.num_add_liquidity = 0
            self.num_rem_liquidity = 0
            
            self.eth_volume = 0
            self.eth_fees = 0
            self.delta_volume = 0
            self.delta_fees = 0
            self.link_volume = 0
            self.link_fees = 0
            self.snx_volume = 0
            self.snx_fees = 0
            self.wbtc_volume = 0
            self.wbtc_fees = 0
            
            
            self.eth_balance = last_pinf.eth_balance
            self.delta_balance = last_pinf.delta_balance
            self.link_balance = last_pinf.link_balance
            self.snx_balance = last_pinf.snx_balance
            self.wbtc_balance = last_pinf.wbtc_balance
            
            self.phoenix_supply = last_pinf.phoenix_supply
            
            self.eth_price = 0
            self.timestamp = 0
            self.block_num = last_pinf.block_num+1
            
            self.phoenix_genesis = 10372700#10372702  
            self.phoenix_address = '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'
        elif from_db is not None:
            #ls = from_str.split(',') 
            
            self.num_tx =               from_db[0]
            self.num_eth_in =        from_db[1]
            self.num_eth_out =         from_db[2]
            self.num_delta_in =      from_db[3]
            self.num_delta_out =       from_db[4]
            self.num_link_in =       from_db[5]
            self.num_link_out =        from_db[6]
            self.num_snx_in =        from_db[7]
            self.num_snx_out =         from_db[8]
            self.num_wbtc_in =       from_db[9]
            self.num_wbtc_out =        from_db[10] 
            
            self.swaps = from_db[11]
            
            self.num_add_liquidity =    from_db[12]
            self.num_rem_liquidity =    from_db[13]
            
            self.eth_volume =           from_db[14]
            self.eth_fees =             from_db[15]
            self.delta_volume =         from_db[16]
            self.delta_fees =           from_db[17]
            self.link_volume =          from_db[18]
            self.link_fees =            from_db[19]
            self.snx_volume =           from_db[10]
            self.snx_fees =             from_db[21]
            self.wbtc_volume =          from_db[22]
            self.wbtc_fees =            from_db[23]
            
            self.eth_balance =          float(from_db[24])
            self.delta_balance =        float(from_db[25])
            self.link_balance =         float(from_db[26])
            self.snx_balance =          float(from_db[27])
            self.wbtc_balance =          float(from_db[28])
            
            self.phoenix_supply =          float(from_db[29])
            
            self.eth_price =            float(from_db[30])
            self.timestamp =            from_db[31]
            self.block_num =            from_db[32] 
            self.phoenix_genesis = 10372700#10372702  
            self.phoenix_address = '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'
        elif from_str is not None:
            ls = from_str.split(',') 
            self.num_tx =              ls[0]
            self.num_eth_in =          ls[1]
            self.num_eth_out =         ls[2]
            self.num_delta_in =        ls[3]
            self.num_delta_out =       ls[4]
            self.num_link_in =         ls[5]
            self.num_link_out =        ls[6]
            self.num_snx_in =          ls[7]
            self.num_snx_out =         ls[8]
            self.num_wbtc_in =         ls[9]
            self.num_wbtc_out =        ls[10]
            
            self.swaps = from_db[11]
            
            self.num_add_liquidity =    ls[12]
            self.num_rem_liquidity =    ls[13]
            
            self.eth_volume =           ls[14]
            self.eth_fees =             ls[15]
            self.delta_volume =         ls[16]
            self.delta_fees =           ls[17]
            self.link_volume =          ls[18]
            self.link_fees =            ls[19]
            self.snx_volume =           ls[10]
            self.snx_fees =             ls[21]
            self.wbtc_volume =          ls[22]
            self.wbtc_fees =            ls[23]
            
            self.eth_balance =          float(ls[24])
            self.delta_balance =        float(ls[25])
            self.link_balance =         float(ls[26])
            self.snx_balance =          float(ls[27])
            self.wbtc_balance =          float(ls[28])
            
            self.phoenix_supply =          float(ls[29])
            
            self.eth_price =            float(ls[30])
            self.timestamp =            ls[31]
            self.block_num =            ls[32] 
            self.phoenix_genesis = 10372700#10372702  
            self.phoenix_address = '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'
        else: 
            self.num_tx = 0
            self.num_eth_in = 0
            self.num_eth_out = 0
            self.num_delta_in = 0
            self.num_delta_out = 0
            self.num_link_in = 0
            self.num_link_out = 0
            self.num_snx_in = 0
            self.num_snx_out = 0
            self.num_wbtc_in = 0
            self.num_wbtc_out = 0
            
            self.swaps = 0
            
            self.num_add_liquidity = 0
            self.num_rem_liquidity = 0
            
            self.eth_volume = 0
            self.eth_fees = 0
            self.delta_volume = 0
            self.delta_fees = 0
            self.link_volume = 0
            self.link_fees = 0
            self.snx_volume = 0
            self.snx_fees = 0
            self.wbtc_volume = 0
            self.wbtc_fees = 0
            
            self.eth_balance = 0
            self.delta_balance = 0
            self.link_balance = 0
            self.snx_balance = 0
            self.wbtc_balance = 0 
            
            self.phoenix_supply = 0
            
            self.eth_price = 0
            self.timestamp = 0
            self.block_num = 10372700
            
            self.phoenix_genesis = 10372700#10372702  
            self.phoenix_address = '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'
        
    def __str__(self): 
        ls = [f'#####################################'
                ,f'num_tx : {self.num_tx}'
                ,f'num_eth_in : {self.num_eth_in}'
                ,f'num_eth_out : {self.num_eth_out}'
                ,f'num_delta_in : {self.num_delta_in}'
                ,f'num_delta_out : {self.num_delta_out}'
                ,f'num_link_in : {self.num_link_in}'
                ,f'num_link_out : {self.num_link_out}'
                ,f'num_snx_in : {self.num_snx_in}'
                ,f'num_snx_out : {self.num_snx_out}'
                ,f'num_wbtc_in : {self.num_wbtc_in}'
                ,f'num_wbtc_out : {self.num_wbtc_out}' 
                ,f'swaps : {self.swaps}' 
                ,f'num_add_liquidity : {self.num_add_liquidity}'
                ,f'num_rem_liquidity : {self.num_rem_liquidity}' 
                ,f'eth_volume : {self.eth_volume}'
                ,f'eth_fees : {self.eth_fees}'
                ,f'delta_volume : {self.delta_volume}'
                ,f'delta_fees : {self.delta_fees}'
                ,f'link_volume : {self.link_volume}'
                ,f'link_fees : {self.link_fees}'
                ,f'snx_volume : {self.snx_volume}'
                ,f'snx_fees : {self.snx_fees}'
                ,f'wbtc_volume : {self.wbtc_volume}'
                ,f'wbtc_fees : {self.wbtc_fees}' 
                ,f'eth_balance : {self.eth_balance}'
                ,f'delta_balance : {self.delta_balance}'
                ,f'link_balance : {self.link_balance}'
                ,f'snx_balance : {self.snx_balance}'
                ,f'wbtc_balance : {self.wbtc_balance}'
                ,f'phoenix_supply : {self.phoenix_supply}'
                ,f'eth_price : {self.eth_price}'
                ,f'timestamp : {self.timestamp}'
                ,f'block_num : {self.block_num}'
                ,f' phoenix_genesis: {self.phoenix_genesis}'
                ,f'phoenix_address : {self.phoenix_address}'
                ,f'#####################################']
        return '\n'.join(ls) 
        
        
    def to_list(self):
        ls = [self.num_tx,
                self.num_eth_in,
                self.num_eth_out,
                self.num_delta_in,
                self.num_delta_out,
                self.num_link_in,
                self.num_link_out,
                self.num_snx_in,
                self.num_snx_out,
                self.num_wbtc_in,
                self.num_wbtc_out,
                self.swaps,
                self.num_add_liquidity,
                self.num_rem_liquidity,
                self.eth_volume,
                self.eth_fees,
                self.delta_volume,
                self.delta_fees,
                self.link_volume,
                self.link_fees,
                self.snx_volume,
                self.snx_fees,
                self.wbtc_volume,
                self.wbtc_fees,
                self.eth_balance,
                self.delta_balance,
                self.link_balance,
                self.snx_balance,
                self.wbtc_balance,
                self.phoenix_supply,
                self.eth_price,
                self.timestamp,
                self.block_num,
                self.phoenix_genesis]
              #self.delta_address
              #self.sta_address 
        return ls
    def to_sql_values(self):
        ls = [str(l) for l in self.to_list()]
        return ','.join(ls)
           
    
    def get_header(self):
        
        txt = 'num_eth_in,num_eth_in,num_eth_out,num_delta_in,num_delta_out,num_link_in,num_link_out,num_snx_in,num_snx_out,num_wbtc_in,num_wbtc_out,swaps,num_add_liquidity,num_remove_liquidity,eth_volume,eth_fees,delta_volume,delta_fees,link_volume,link_fees,snx_volume,snx_fees,wbtc_volume,wbtc_fees,eth_balance,delta_balance,link_balance,snx_balance,wbtc_balance,phoenix_supply,eth_price,timestamp,block_num,phoenix_genesis'
        
        return txt