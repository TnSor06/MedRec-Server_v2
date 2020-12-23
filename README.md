# MedRec-Server-v2
## Medrec server using graphql

### Prerequisite
- Docker
- NodeJS
- Python3.x

### Pre-Setup
1. Go to prisma folder ("prisma-medrec") in command line
2. Type "docker-compose up -d" command in terminal to push images(Prisma and Mongo Database Image) for the project
3. Deploy Prisma Model using "prisma deploy" command.
4. Install python package hl7apy using "pip3 install hl7apy"

### Setup
1. Install all packages using command in root folder of project: npm install --unsafe-perm --allow-root
2. Start server: npm start
3. sampleQuery.txt contains all queries which can be executed
4. Open localhost:4000 and you can visit docs and also execute queries or mutations

> Note: 
> 1. After resgistering the user it is to be verified. (SuperUser Privileges)
>    1. Type "prisma token" in terminal in prisma folder of the project -> Copy token
>    2. Go to localhost:4466/_admin and put token in top left setting icon wherein token field is specified
>    3. Approve user by searching the user and setting verified to true
>    4. these changes are to be saved by clicking "Save Changes to Database" 
>
>2. Some field requires HTTP HEADERS to be passed when executing the query. HEADERS requires token to be generated with the login query given in sampleQuery with respective email >and password.
>    -> Format of header is given in login query
