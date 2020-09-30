-----------------------------------------------------------------------------------------------------
--COST IN TOKENS OF MINTING BPT BY TIMESTAMP ------------------------------------------------------
-----------------------------------------------------------------------------------------------------
--current
    select timestamp
        , eth_balance/phoenix_supply as eth_cost
        , delta_balance/phoenix_supply as delta_cost
        , link_balance/phoenix_supply as link_cost
        , snx_balance/phoenix_supply as snx_cost
        , wbtc_balance/phoenix_supply as wbtc_cost
    from phoenix_tx_monitor
    where rn = 1
    order by timestamp desc
    --limit 1; --uncomment for getting  snapshot
    ;

--24h ago
    select timestamp
        , eth_balance/phoenix_supply as eth_cost
        , delta_balance/phoenix_supply as delta_cost
        , link_balance/phoenix_supply as link_cost
        , snx_balance/phoenix_supply as snx_cost
        , wbtc_balance/phoenix_supply as wbtc_cost
    from phoenix_tx_monitor
    where to_timestamp("timestamp") <  now() - interval '1 day' 
    and rn = 1
    order by timestamp desc
    --limit 1; --uncomment for getting  snapshot
    ;

--7d ago
    select timestamp,
        , eth_balance/phoenix_supply as eth_cost
        , delta_balance/phoenix_supply as delta_cost
        , link_balance/phoenix_supply as link_cost
        , snx_balance/phoenix_supply as snx_cost
        , wbtc_balance/phoenix_supply as wbtc_cost
    from phoenix_tx_monitor
    where to_timestamp("timestamp") < now() - interval '7 days'
    and rn = 1 
    order by timestamp desc
    --limit 1 --uncomment for getting  snapshot
    ;
--1m
    select timestamp,
        , eth_balance/phoenix_supply as eth_cost
        , delta_balance/phoenix_supply as delta_cost
        , link_balance/phoenix_supply as link_cost
        , snx_balance/phoenix_supply as snx_cost
        , wbtc_balance/phoenix_supply as wbtc_cost
    from phoenix_tx_monitor
    where to_timestamp("timestamp") < now() - interval '1 month'
    and rn = 1 
    order by timestamp desc
    --limit 1 --uncomment for getting  snapshot
    ;
-----------------------------------------------------------------------------------------------------
--DATASET OF BALANCE BY TIMESTAMP--------------------------------------------------------------------
----------------------------------------------------------------------------------------------------- 
-- Total liquidity can be calculated through eth_balance * 2
--current snapshot
    select timestamp, eth_balance, delta_balance, link_balance, snx_balance, wbtc_balance
    from phoenix_tx_monitor 
    where rn = 1
    order by timestamp desc
    limit 1; 
--24h
    select timestamp, eth_balance, delta_balance, link_balance, snx_balance, wbtc_balance 
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '1 day' 
    and rn = 1
    order by timestamp desc 
    --limit 1; --uncomment for getting  snapshot
    ;
--7d
    select timestamp, eth_balance, delta_balance, link_balance, snx_balance, wbtc_balance
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '7 day' 
    and rn = 1
    order by timestamp desc 
    --limit 1; uncomment for snapshot
    ;
--1m
    select timestamp, eth_balance, delta_balance, link_balance, snx_balance, wbtc_balance
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '1 month' 
    and rn = 1
    order by timestamp desc
    --limit 1; uncomment for snapshot
    ;

-----------------------------------------------------------------------------------------------------
----VOLUME BY TIMESTAMP dataset ---------------------------------------------------------------------
-- op_type = 1 -> swaps
----------------------------------------------------------------------------------------------------- 
--delta volume 24h
    select timestamp, eth_volume, delta_volume, link_volume, snx_volume, wbtc_volume
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '1 day' 
    and op_type = 1 --swap
    order by timestamp desc, rn asc;

--delta volume 7d 
    select timestamp, eth_volume, delta_volume, link_volume, snx_volume, wbtc_volume
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '7 day' 
    and op_type = 1 --swap
    order by timestamp desc, rn asc;

--delta volume 1 month
    select timestamp, eth_volume, delta_volume, link_volume, snx_volume, wbtc_volume
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '1 month'
    and op_type = 1 --swap
    order by timestamp desc, rn asc;

-----------------------------------------------------------------------------------------------------
---- AGG. VOLUME BY HOURSLOT ------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------  
--delta volume 24h
    select hourslot, sum(eth_volume) as eth_vol, sum(delta_volume) as delta_vol, sum(link_volume) as link_vol, sum(snx_volume) as snx_vol, sum(wbtc_volume) as wbtc_vol
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '1 day' 
    and op_type = 1 --swap
    group by hourslot 
    order by hourslot desc;

--delta volume 7d 
    select hourslot, sum(eth_volume) as eth_vol, sum(delta_volume) as delta_vol, sum(link_volume) as link_vol, sum(snx_volume) as snx_vol, sum(wbtc_volume) as wbtc_vol
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '7 day' 
    and op_type = 1 --swap
    group by hourslot 
    order by hourslot desc;

--delta volume 1 month
    select hourslot, sum(eth_volume) as eth_vol, sum(delta_volume) as delta_vol, sum(link_volume) as link_vol, sum(snx_volume) as snx_vol, sum(wbtc_volume) as wbtc_vol
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '1 month'
    and op_type = 1 --swap
    group by hourslot
    order by hourslot desc;
    
-----------------------------------------------------------------------------------------------------
----AGG. VOLUME BY DAYSLOT --------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
--delta volume 7d 
    select hourslot/100 , sum(eth_volume) as eth_vol, sum(delta_volume) as delta_vol, sum(link_volume) as link_vol, sum(snx_volume) as snx_vol, sum(wbtc_volume) as wbtc_vol
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '7 day' 
    and op_type = 1 --swap
    group by hourslot/100  
    order by hourslot/100  desc;

--delta volume 1 month
    select hourslot/100 , sum(eth_volume) as eth_vol, sum(delta_volume) as delta_vol, sum(link_volume) as link_vol, sum(snx_volume) as snx_vol, sum(wbtc_volume) as wbtc_vol
    from phoenix_tx_monitor
    where to_timestamp("timestamp") > now() - interval '1 month'
    and op_type = 1 --swap
    group by hourslot/100  
    order by hourslot/100  desc;

