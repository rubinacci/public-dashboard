

--delta cost in tokens for %APY currenct
select timestamp, eth_balance/delta_supply as eth_cost, sta_balance/delta_supply as sta_cost
from delta_tx_monitor
where rn = 1
order by timestamp desc
limit 1;

--delta cost in tokens for %APY 24 h ago
select timestamp, eth_balance/delta_supply as eth_cost, sta_balance/delta_supply as sta_cost
from delta_tx_monitor
where to_timestamp("timestamp") <  now() - interval '1 day' 
and rn = 1
order by timestamp desc
limit 1;

--delta cost in tokens for %APY 7d ago
select timestamp, eth_balance/delta_supply as eth_cost, sta_balance/delta_supply as sta_cost
from delta_tx_monitor
where to_timestamp("timestamp") < now() - interval '7 days'
and rn = 1 
order by timestamp desc
limit 1;

--delta cost in tokens for %APY 1m ago
select timestamp, eth_balance/delta_supply as eth_cost, sta_balance/delta_supply as sta_cost
from delta_tx_monitor
where to_timestamp("timestamp") < now() - interval '1 month'
and rn = 1 
order by timestamp desc
limit 1;

--delta liquidity current
select timestamp, eth_balance, sta_balance 
from delta_tx_monitor 
where rn = 1
order by timestamp desc
limit 1;

--delta liquidity 24h
select timestamp, eth_balance, sta_balance 
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '1 day' 
and rn = 1
order by timestamp desc 

--delta liquidity 7d
select timestamp, eth_balance, sta_balance
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '7 day' 
and rn = 1
order by timestamp desc 

--delta liquidity 1 month
select timestamp, eth_balance, sta_balance
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '1 month' 
and rn = 1
order by timestamp desc;

--delta price current mint price
select timestamp, 
    (eth_balance/delta_supply)*2 as delta_mint_price_in_eth,
    eth_balance/delta_supply as eth_min_cost,         
    sta_balance/delta_supply as sta_min_cost
from delta_tx_monitor 
where rn = 1
order by timestamp desc
limit 1;

--delta price 24h
select timestamp, 
    (eth_balance/delta_supply)*2 as delta_mint_price_in_eth,
    eth_balance/delta_supply as eth_min_cost,         
    sta_balance/delta_supply as sta_min_cost
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '1 day'  
and rn = 1
order by timestamp desc; 

--delta price 7d
select timestamp, 
    (eth_balance/delta_supply)*2 as delta_mint_price_in_eth,
    eth_balance/delta_supply as eth_min_cost,         
    sta_balance/delta_supply as sta_min_cost
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '7 day'  
and rn = 1
order by timestamp desc; 

--delta price 1 month
select timestamp, 
    (eth_balance/delta_supply)*2 as delta_mint_price_in_eth,
    eth_balance/delta_supply as eth_min_cost,         
    sta_balance/delta_supply as sta_min_cost
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '1 month'  
and rn = 1
order by timestamp desc; 
 


--delta volume 24h
select timestamp, eth_volume, sta_volume
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '1 day' 
and op_type = 1
order by timestamp desc;

--delta volume 7d 
select timestamp, eth_volume, sta_volume
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '7 day' 
and op_type = 1
order by timestamp desc;

--delta volume 1 month
select timestamp, eth_volume, sta_volume
from delta_tx_monitor
where to_timestamp("timestamp") > now() - interval '1 month'
and op_type = 1
order by timestamp desc;