This code searches all transactions concerning Delta and Phoenix pools through etherscan api and stores the data on a PostgreSQL server.
Files:
    phoenix_monitor.py
        python phoenix_monitor.py --create_tables True,False | def. False Drops if exist and creates monitor table
                                  --bootstrap True,False | def. False. Trucantes current monitor table
                                  --daemon True,False | def. False. Keeps querying for new blocks each 13 sec
    delta_monitor.py
        python delta_monitor.py --create_tables True,False | default False Drops if exist and creates monitor table
                                --bootstrap True,False | default False. Trucantes current monitor table
                                --daemon True,False | default False. Keeps querying for new blocks each 13 sec
    
    PhoenixTxInfo.py,DeltaTxInfo.py Classes to store tx_data

    etherscan_api.py: etherscan api wrappper
    
    