# OrderManagementSolution
 Order Management Solution (Inspired by Edily of LENET)

## How to Run
the code can be run inside of Visual Studio.  
the postgres Database & .NET Core Api are running in a docker container  
and the FrontEnd Part is run on the local mchine (for now)  

#### without visual Studio
You need to use docker-compose build  
and run it using docker-compose  -f "<path_to_project>\docker-compose.yml" -f "<path_to_project>\docker-compose.override.yml" -f "<path_to_project>\obj\Docker\docker-compose.vs.debug.g.yml" -p backendContainer --ansi never up -d  backend db  
then install and run the front end using npm i & npm run start  
