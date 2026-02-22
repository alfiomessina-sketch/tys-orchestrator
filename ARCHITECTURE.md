\# TYS ORCHESTRATOR – ARCHITECTURE v2.1



\## Current Stack



\- Node.js + Express

\- SQLite (database.db)

\- AzuraCast API integration

\- Ollama (llama3 local AI engine)

\- GitHub version controlled

\- Port 3000 (Windows local environment)



---



\## System Philosophy



TYS Orchestrator is now the SINGLE CORE SYSTEM.



There is no separate Agent project anymore.



AI is embedded directly inside the backend.



---



\## Unified Architecture



CLIENT / ADMIN  

↓  

HTTP API Layer  

↓  

Orchestrator Core  

↓  

AI Decision Layer  

↓  

Validator Layer  

↓  

Executor Layer  

↓  

Azura Service + Database  



---



\## AI Provider



Primary Provider: Ollama (llama3 local)  

OpenAI: Disabled (budget phase)



AI is fully local and cost-free.



---



\## AI Rules (Non-Negotiable)



1\. AI CANNOT write directly to database

2\. AI CANNOT call Azura API

3\. AI ONLY produces structured JSON actions

4\. All actions must be validated before execution

5\. Executor performs all real operations



---



\## Folder Structure (Target)



\- /ai

&nbsp;   - agent.js

&nbsp;   - aiService.js

&nbsp;   - providers/ollamaProvider.js

&nbsp;   - memory.js

&nbsp;   - prompts.js

&nbsp;   - schema.js



\- /core

&nbsp;   - validator.js

&nbsp;   - executor.js

&nbsp;   - actionRouter.js



\- /routes

\- /services

\- /data/agent\_memory.json



---



\## Strategic Positioning



TYS Orchestrator is not a radio tool.



It is an AI-powered commercial audio infrastructure.



---



\## Version



v2.1 – AI Core Embedded (Ollama Local)

