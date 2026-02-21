\# TYS ORCHESTRATOR – API MAP



GET /

\- Health check



POST /api/clients

\- Create client with trial



POST /api/clients/:id/activate

\- Activate client

\- Create Azura station



GET /api/clients

\- List clients (dashboard)



POST /api/clients/:id/payment

\- Update payment status



POST /api/clients/:id/suspend

\- Suspend client



POST /api/clients/:id/stations

\- Create additional station (if allowed by plan)

