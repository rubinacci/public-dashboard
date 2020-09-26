import json
import requests as req
from requests.exceptions import HTTPError
from datetime import timezone, datetime 
#parameters
request_limit_per_second = 10
request_limit_per_minute = 1000 

verbose = 0

get_api_keys = ['G1CAFABPBP9PI3DSNVVIYFZ2FDJ452EAFI','I6SH3EVBS1WYTKDEG68SB11BW2Q8JA9Y9Z', 'HFZ8Y2ZS7K8AP6ZQTYUXNZVRBNCTTV65HM','BFRAFP3VX4FPZR15TZGNF11RFBVMSE5HD5','K6S9QWTYWMIQYH2SY8QUQK62UEY76FH2BU','DX18C6937Q8UZXMHJ5IVUTRZEY83XR76H5']
base_url = 'https://api.etherscan.io/'

def dprint(msg):
    if verbose == 1:
        print(msg)

def get_api_key():
    key = get_api_keys.pop()
    get_api_keys.append(key)
    return key

def safe_get(url):
    try:  
        dprint(url)
        response = req.get(url) 
        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        binary = response.content
        output = json.loads(binary)
        return output.get('result', output)
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        print(f'Other error occurred: {err}')  # Python 3.6

def get_event_logs(address,fromBlock='latest',toBlock='latest'):
    '''
        status	"1"
        message	"OK"
        result	
            0	
                address	"0xc49961d88a1ba27e29faa79412d495cc8bfe4d5f"
                topics	
                    0	"0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d" 
                    1	"0x0000000000000000000000000000000000000000000000000000000000000000"
                    2	"0x0000000000000000000000007a1504ef1021e7fd698ef40a9692e8f2872d785f"
                    3	"0x0000000000000000000000007a1504ef1021e7fd698ef40a9692e8f2872d785f"
                data	"0x"
                blockNumber	"0x9cdb1c"
                timeStamp	"0x5ee952c9"
                gasPrice	"0x4a817c800"
                gasUsed	"0x27bae5"
                logIndex	"0x32"
                transactionHash	"0x00c51a8df77869fbe8bab4779e8491df4e250abd8f111aedafdfcedac195939c"
                transactionIndex	"0x41"
    '''
     
    #build url
    url = base_url +'api?module=logs&action=getLogs&fromBlock={fBlock}&toBlock={tBlock}&address={address}&apikey={key}'
    url = url.replace('{fBlock}',str(fromBlock))
    url = url.replace('{tBlock}',str(toBlock))
    url = url.replace('{address}',str(address))
    url = url.replace('{key}',str(get_api_key()))
    #get
    return safe_get(url)

def get_previous_block_by_offset_timestamp(unix_offset):
    '''
        Returns previous block by a given timestamp
    '''
    
    #build url
    #unix_timestamp = str(int(datetime.now(tz=timezone.utc).timestamp()))
    unix_timestamp = str(int(datetime.now(tz=timezone.utc).timestamp())) - unix_offset
    
    url = base_url +'api?module=block&action=getblocknobytime&timestamp={timestamp}&closest=before&apikey={key}'
    url = url.replace('{timestamp}',str(unix_timestamp)) 
    url = url.replace('{key}',str(get_api_key()))
    #get 
    return safe_get(url)

def get_transaction_history_contract(contractaddress,startblock=0,endblock=999999):
    #build url
    url = base_url +f'api?module=account&action=tokentx&contractaddress={contractaddress}&startblock={startblock}&endblock={endblock}&sort=asc&apikey={get_api_key()}'
    #get
    return safe_get(url)
def get_transaction_history_address(address,startblock=0,endblock=999999):
    #build url
    url = base_url +f'api?module=account&action=tokentx&address={address}&startblock={startblock}&endblock={endblock}&sort=asc&apikey={get_api_key()}'
    #get
    return safe_get(url)
 
def get_block_by_timestamp(unix_timestamp): 
    #build url
    #unix_timestamp = str(int(datetime.now(tz=timezone.utc).timestamp()))  
    url = base_url +'api?module=block&action=getblocknobytime&timestamp={timestamp}&closest=before&apikey={key}'
    url = url.replace('{timestamp}',str(unix_timestamp)) 
    url = url.replace('{key}',str(get_api_key()))
    #get 
    return safe_get(url)

def get_hourly_blocks(start_date,true_hour=False):
    ''' 
        returns first and last block from the hourslot of the given datetime
    '''
    global last_block
    if true_hour:
        delta = datetime.timedelta(minutes=start_date.minute, seconds=start_date.second, microseconds=start_date.microsecond)
        start_date = start_date - delta   
    end_date = start_date \
                + datetime.timedelta(hours=1) \
                - datetime.timedelta(seconds=1)
                
    start_timestamp = start_date.timestamp()
    end_timestamp = end_date.timestamp()
    dprint(f'Getting first block from {start_date} to {end_date}')
    #get first hourly block
    first_block = int(get_block_by_timestamp(int(start_timestamp)))
    #if last iteration block is the 
    if last_block == first_block:
        first_block += 1
    #obtain last block from this hour
    last_block = int(get_block_by_timestamp(int(end_timestamp)))
    
    return first_block, last_block

def get_token_balance(address, contract,block='latest'):
    #build url
    #unix_timestamp = str(int(datetime.now(tz=timezone.utc).timestamp()))   
    url = base_url + f'api?module=account&action=tokenbalancehistory&contractaddress={contract}&address={contract}&blockno={block}&apikey={get_api_key()}'
    print(url)
    #get 
    return safe_get(url)


def get_token_supply(contract,block='latest'):
    #build url
    #unix_timestamp = str(int(datetime.now(tz=timezone.utc).timestamp()))   
    url = base_url + f'api?module=stats&action=tokensupplyhistory&contractaddress={contract}&blockno={block}&apikey={get_api_key()}'  
    print(url)
    #get 
    return safe_get(url)

 

def get_previous_block_num(unix_timestamp=None): 
    '''
        Returns last mined block num
    '''
    
    #build url
    if unix_timestamp is None:
        unix_timestamp = str(int(datetime.now(tz=timezone.utc).timestamp()))
    
    url = base_url +'api?module=block&action=getblocknobytime&timestamp={timestamp}&closest=before&apikey={key}' 
    url = url.replace('{key}',str(get_api_key()))
    url = url.replace('{timestamp}',str(unix_timestamp))
    #get 
    return safe_get(url) 
