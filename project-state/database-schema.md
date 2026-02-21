\# TYS ORCHESTRATOR – DATABASE SCHEMA



Table: clients

\- id (INTEGER PRIMARY KEY AUTOINCREMENT)

\- name (TEXT)

\- email (TEXT)

\- plan (TEXT)

\- status (TEXT)

\- payment\_status (TEXT)

\- station\_id (TEXT)

\- max\_stations (INTEGER)

\- activated\_at (TEXT)

\- expires\_at (TEXT)

\- created\_at (TEXT DEFAULT CURRENT\_TIMESTAMP)



Table: stations

\- id (INTEGER PRIMARY KEY AUTOINCREMENT)

\- client\_id (INTEGER)

\- station\_name (TEXT)

\- azura\_id (TEXT)

\- max\_listeners (INTEGER)

\- created\_at (TEXT DEFAULT CURRENT\_TIMESTAMP)



Relationships:

\- One client can have multiple stations

\- client\_id in stations references clients.id

