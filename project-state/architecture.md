\# TYS ORCHESTRATOR – ARCHITECTURE STATE



\## Current Stack

\- Node.js + Express

\- SQLite (database.db)

\- AzuraCast API integration

\- GitHub repository cleaned (no node\_modules, no runtime DB)

\- Port 3000



\## Current System Structure



Orchestrator is the main backend engine.



Responsibilities:

\- Client management

\- Plan logic (29 / 69 / 159)

\- Multi-station control

\- Station creation via Azura

\- Persistent database layer



\## Historical Context



Originally there were two systems:

\- Agent (AI + local memory)

\- Orchestrator (radio + DB)



Decision taken:

Agent will be integrated into Orchestrator.

Final architecture will be a single unified backend.



\## Target Architecture



Single backend containing:

\- AI Engine (Ollama or alternative)

\- Plan Engine

\- Billing logic

\- Azura service layer

\- Database persistence

\- Multi-tenant multi-station support



\## Next Strategic Step



Integrate AI module directly inside Orchestrator

and remove separate Agent project.

