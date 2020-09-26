phoenix_monitor.py
    python phoenix_monitor.py --create_tables True,False | def. False Drops if exist and recreate monitor tables
                            --bootstrap True,False | def. False. Trucantes current monitor tables
                            --daemon True,False | def. False. Keeps querying for new blocks each 13 sec
delta_monitor.py
    python delta_monitor.py --create_tables True,False | def. False Drops if exist and recreate monitor tables
                            --bootstrap True,False | def. False. Trucantes current monitor tables
                            --daemon True,False | def. False. Keeps querying for new blocks each 13 sec
PhoenixTxInfo, DeltaTxInfo, PhoenixInfo: clases para almacenar las transacciones

etherscan_api.py wrapper de etherscan
ethplorer_api.py wrapper de etherscan

CREATE_TABLES.sql: queries de creación de tablas de monitorización

 