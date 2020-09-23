import json
import requests as req
from requests.exceptions import HTTPError

verbose = 1
#parameters
request_limit_per_second = 10
request_limit_per_minute = 1000
#api_key = '?apiKey=freekey'
#api_key = '?apiKey=EK-2eFR1-oAsJyAU-NQyA1'
api_key = '?apiKey=EK-4TPpP-nYS5d9b-mdLsy'

get_api_keys = ['?apiKey=EK-4TPpP-nYS5d9b-mdLsy','?apiKey=EK-2eFR1-oAsJyAU-NQyA1']
base_url = 'https://api.ethplorer.io/'

def get_api_key():
    key = get_api_keys.pop()
    get_api_keys.append(key)
    return key
    
def dprint(text):
    if verbose == 1:
        print(text)

def get_top_holders(coin_address,num_holders=None):
    '''
        Returns list with dict {address,balance,share}
        {
            holders: [
                {
                    address:   # address of holder,
                    balance:   # token balance,
                    share:     # share of holder in percent
                },
                ...
            ]
        }
    '''

    #build url
    url = base_url +'getTopTokenHolders/{address}'+get_api_key()
    if num_holders is not None:
        url = url +'&limit='+str(num_holders)
    url = url.replace('{address}',str(coin_address))
    #get
    try:

        dprint('Getting top holders\n\t {}'.format(url))
        response = req.get(url)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        binary = response.content
        output = json.loads(binary)
        return output.get('holders',None)
    except HTTPError as http_err:
        dprint(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        dprint(f'Other error occurred: {err}')  # Python 3.6
def get_address_transactions(address, num_transactions=10, timestamp=None, showZeroValues=0):
    '''
    limit:          maximum number of operations [1 - 50, default = 10]
    timestamp:      starting offset for operations [optional, unix timestamp]
    showZeroValues: show transactions with zero ETH value, default = 0
    [
        {
            timestamp:       # operation timestamp
            from:            # source address (if two addresses involved),
            to:              # destination address (if two addresses involved),
            hash:            # transaction hash
            value:           # ETH value (as is, not reduced to a floating point value),
            input:           # input data
            success:         # true if transactions was completed, false if failed
        },
    ]
    '''
    #build url
    url = base_url +'getAddressTransactions/{address}'+get_api_key()
    url = url.replace('{address}',str(address))
    if num_transactions is not None:
        url = url +'&limit='+str(num_transactions)
    if timestamp is not None:
        url = url +'&timestamp='+str(timestamp)
    if showZeroValues is not None:
        url = url +'&showZeroValues='+str(showZeroValues)
    #get
    try:

        dprint('Getting Transactions from address\n\t {}'.format(url))
        response = req.get(url)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        binary = response.content
        output = json.loads(binary)
        return output
    except HTTPError as http_err:
        dprint(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        dprint(f'Other error occurred: {err}')  # Python 3.6

def get_address_history(address, token=None, type=None, limit=None, timestamp=None):
    '''
    address
    token:     show only specified token address operations
    type:      show operations of specified type only
    limit:     maximum number of operations [1 - 10, default = 10]
    timestamp: starting offset for operations [optional, unix timestamp]
    {
     operations: [
        {
            timestamp:       # operation timestamp
            transactionHash: # transaction hash
            tokenInfo:       # token data (same format as token info),
            type:            # operation type (transfer, approve, issuance, mint, burn, etc),
            address:         # operation target address (if one),
            from:            # source address (if two addresses involved),
            to:              # destination address (if two addresses involved),
            value:           # operation value (as is, not reduced to a floating point value),
        },
        ...
        ]
    }
    '''
    #build url
    url = base_url +'getAddressHistory/{address}'+get_api_key()
    url = url.replace('{address}',str(address))
    if token is not None:
        url = url +'&token='+str(token)
    if type is not None:
        url = url +'&type='+str(type)
    if limit is not None:
        url = url +'&limit='+str(limit)
    if timestamp is not None:
        url = url +'&timestamp='+str(timestamp)
    #get
    try:

        dprint('Getting transactions from address\n\t {}'.format(url))
        response = req.get(url)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        binary = response.content
        output = json.loads(binary)
        return output
    except HTTPError as http_err:
        dprint(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        dprint(f'Other error occurred: {err}')  # Python 3.6

def get_transaction_info(transaction_hash):
    '''
    limit:          maximum number of operations [1 - 50, default = 10]
    timestamp:      starting offset for operations [optional, unix timestamp]
    showZeroValues: show transactions with zero ETH value, default = 0
        {
            hash:          # transaction hash,
            timestamp:     # transaction block time,
            blockNumber:   # transaction block number,
            confirmations: # number of confirmations,
            success:       # true if there were no errors during tx execution
            from:          # source address,
            to:            # destination address,
            value:         # ETH send value,
            input:         # transaction input data (hex),
            gasLimit:      # gas limit set to this transaction,
            gasUsed:       # gas used for this transaction,
            logs: [        # event logs
                {
                    address: # log record address
                    topics:  # log record topics
                    data:    # log record data
                },
                ...
            ],
            operations: [  # token operations list for this transaction
                {
                    # Same format as /getTokenHistory
                },
                ...
            ]
        }
    '''
    #build url
    url = base_url +'getTxInfo/{transaction_hash}'+get_api_key()
    url = url.replace('{transaction_hash}',str(transaction_hash)) 
    #get
    try:

        dprint('Getting tx info hash: \n\t {}'.format(url))
        response = req.get(url)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        binary = response.content
        output = json.loads(binary)
        return output
    except HTTPError as http_err:
        dprint(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        dprint(f'Other error occurred: {err}')  # Python 3.6

def get_token_history(address, type='transfer',limit=1000, start_timestamp=0):
    '''
        type:      show operations of specified type only ( default = transfer)
        limit:     maximum number of operations [1 - 1000, default = 10]
        timestamp: starting offset for operations [optional, unix timestamp]
            {
                operations: [
                    {
                    timestamp:       # operation timestamp
                    transactionHash: # transaction hash
                    tokenInfo:       # token data (same format as token info),
                    type:            # operation type (transfer, approve, issuance, mint, burn, etc),
                    address:         # operation target address (if one),
                    from:            # source address (if two addresses involved),
                    to:              # destination address (if two addresses involved),
                    value:           # operation value (as is, not reduced to a floating point value),
                    },
                ]
            }
    '''
    #build url
    url = base_url + f'getTokenHistory/{address}{get_api_key()}&type={type}&limit={limit}&timestamp={start_timestamp}' 
    #get
    try:
        #0xff71cb760666ab06aa73f34995b42dd4b85ea07b?apiKey=freekey&type=transfer&limit=5
        dprint('Getting get token history: \n\t {}'.format(url))
        response = req.get(url)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        binary = response.content
        output = json.loads(binary)
        return output
    except HTTPError as http_err:
        dprint(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        dprint(f'Other error occurred: {err}')  # Python 3.6

def get_address_info(address):
    '''
    token: show balances for specified token address only
    showETHTotals: request total incoming and outgoing ETH values [true/false, default = false]
    {
        address: # address,
        ETH: {   # ETH specific information
            balance:  # ETH balance
            totalIn:  # Total incoming ETH value (showETHTotals parameter should be set to get this value)
            totalOut: # Total outgoing ETH value (showETHTotals parameter should be set to get this value)
        },
        contractInfo: {  # exists if specified address is a contract
           creatorAddress:  # contract creator address,
           transactionHash: # contract creation transaction hash,
           timestamp:       # contract creation timestamp
        },
        tokenInfo:  # exists if specified address is a token contract address (same format as token info),
        tokens: [   # exists if specified address has any token balances
            {
                tokenInfo: # token data (same format as token info),
                balance:   # token balance (as is, not reduced to a floating point value),
                totalIn:   # total incoming token value
                totalOut:  # total outgoing token value
            },
            ...
        ],
        countTxs:    # Total count of incoming and outgoing transactions (including creation one),
    }
    '''
    address = address.lower()
    # build url
    url = base_url + 'getAddressInfo/{address}' + get_api_key()
    url = url.replace('{address}', str(address))
    # get
    try:

        dprint('Getting address info hash: \n\t {}'.format(url))
        response = req.get(url)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        binary = response.content
        output = json.loads(binary)
        return output
    except HTTPError as http_err:
        dprint(f'HTTP error occurred: {http_err}')  # Python 3.6
    except Exception as err:
        dprint(f'Other error occurred: {err}')  # Python 3.6


 
    
