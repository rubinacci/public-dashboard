drop table if exists delta_tx_monitor;
CREATE TABLE delta_tx_monitor (
  tx_hash text DEFAULT NULL,
  rn smallint DEFAULT NULL,
  timestamp bigint DEFAULT NULL,
  block_num bigint DEFAULT NULL,
  op_type smallint DEFAULT NULL,
  input_token_symbol text DEFAULT NULL,
  input_token_volume double precision DEFAULT NULL,
  input_token_fees double precision DEFAULT NULL,
  input_token_eth_price double precision DEFAULT NULL,
  output_token_symbol text DEFAULT NULL,
  output_token_volume double precision DEFAULT NULL,
  output_token_fees double precision DEFAULT NULL,
  output_token_eth_price double precision DEFAULT NULL,
  sta_eth_price double precision DEFAULT NULL,
  eth_usd_price double precision DEFAULT NULL,
  eth_balance double precision DEFAULT NULL,
  sta_balance double precision DEFAULT NULL,
  eth_volume double precision DEFAULT NULL,
  sta_volume double precision DEFAULT NULL,
  delta_supply double precision DEFAULT NULL, 
  hourslot bigint DEFAULT NULL
);

create index idx_delta_tx_monitor_block_num
on delta_tx_monitor
using btree(block_num, rn);

create index idx_delta_tx_monitor_ts
on delta_tx_monitor
using btree(timestamp, rn);


 drop table if exists phoenix_tx_monitor;

CREATE TABLE phoenix_tx_monitor (
  tx_hash text DEFAULT NULL,
  rn smallint DEFAULT NULL,
  timestamp bigint DEFAULT NULL,
  block_num bigint DEFAULT NULL,
  op_type smallint DEFAULT NULL,
  input_token_symbol text DEFAULT NULL,
  input_token_volume double precision DEFAULT NULL,
  input_token_fees double precision DEFAULT NULL,
  input_token_eth_price double precision DEFAULT NULL,
  output_token_symbol text DEFAULT NULL,
  output_token_volume double precision DEFAULT NULL,
  output_token_fees double precision DEFAULT NULL,
  output_token_eth_price double precision DEFAULT NULL,
  eth_usd_price double precision DEFAULT NULL,
  delta_eth_price double precision DEFAULT NULL,
  link_eth_price double precision DEFAULT NULL,
  snx_eth_price double precision DEFAULT NULL,
  wbtc_eth_price double precision DEFAULT NULL,
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
  phoenix_supply double precision DEFAULT NULL, 
  hourslot bigint DEFAULT NULL
);

create index idx_phoenix_tx_monitor_block_num
on phoenix_tx_monitor
using btree(block_num, rn);

create index idx_phoenix_tx_monitor_ts
on phoenix_tx_monitor
using btree(timestamp, rn);





